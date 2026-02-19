import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAppState } from "../stores/useAppState";
import { useUserStore } from "../stores/useUserStore";
import { usersService } from "../services/usersServiceInstance";
import SettingsService from "../services/SettingsService";
import User from "../models/User";
import { timestampToMillis } from "../lib/functions";

export function useBootstrapUser() {
	const router = useRouter();
	const settingsService = new SettingsService();
	const setUser = useUserStore((state) => state.setUser);
	const setRemoteUser = useUserStore((state) => state.setRemoteUser);
	const setLocalUser = useUserStore((state) => state.setLocalUser);
	const { redirectedToSadhana, setRedirectedToSadhana } = useAppState();
	const [isLoading, setIsLoading] = useState(false);
	const hasMounted = useRef(false);

	useEffect(() => {
		hasMounted.current = true;
	}, []);

	const forwardNextScreen = (
		localUser: User | null,
		remoteUser: User | null,
		username: string,
		manualRedirect = false,
	) => {
		if ((!localUser?.pin && remoteUser?.pin) || localUser?.pin !== remoteUser?.pin) {
			router.push({ pathname: "/pin-auth", params: { username } });
		} else if (!localUser?.pin && !remoteUser?.pin) {
			router.push({
				pathname: "/pin-setup",
				params: { username },
			});
		} else if (manualRedirect || !redirectedToSadhana) {
			// Allow redirect if manual call or auto first-time redirect
			setRedirectedToSadhana(true);
			router.push({
				pathname: "/sadhana-list",
				params: { username },
			});
		}

		setIsLoading(false);
	};

	const bootstrap = useCallback(
		async (username?: string, manualRedirect = false) => {
			if (!hasMounted.current || !username) return;
			setIsLoading(true);
			const trimmedUsername = username.trim();
			await usersService.saveUsername(trimmedUsername);
			const {
				user,
				localUser: storeLocalUser,
				remoteUser: storeRemoteUser,
			} = useUserStore.getState();

			if (
				storeLocalUser &&
				storeRemoteUser &&
				trimmedUsername === user?.username &&
				trimmedUsername === storeLocalUser.username &&
				trimmedUsername === storeRemoteUser?.username
			) {
				console.log("forwarding to next screen", trimmedUsername);
				return forwardNextScreen(storeLocalUser, storeRemoteUser, trimmedUsername, manualRedirect);
			}

			const [localUser, remoteUser] = await Promise.all([
				usersService.getLocalUser(trimmedUsername),
				usersService.getUser(trimmedUsername),
			]);
			console.log("localUser", localUser?.username, localUser?.updatedAt);
			console.log("remoteUser", remoteUser?.username, remoteUser?.updatedAt);

			// Merge users: pick the latest
			let finalUser = localUser;
			if (!finalUser) finalUser = remoteUser;
			else if (
				remoteUser &&
				remoteUser.updatedAt &&
				timestampToMillis(remoteUser.updatedAt) >
					timestampToMillis(finalUser.updatedAt || { seconds: 0, nanoseconds: 0 })
			) {
				finalUser = remoteUser;
			}

			// Update user state safely
			finalUser && setUser(finalUser);
			remoteUser && setRemoteUser(remoteUser);
			localUser && setLocalUser(localUser);

			// If no remote user, create one
			if (!remoteUser) {
				const newUser = await usersService.createUser({
					username: trimmedUsername,
					sadhanaData: [],
				});
				newUser && setUser(newUser);
				settingsService.createSettings({ allowNotifications: true });
			}

			forwardNextScreen(localUser, remoteUser, trimmedUsername, manualRedirect);
		},
		[router, setUser, redirectedToSadhana, setRedirectedToSadhana],
	);

	return { bootstrap, isLoading };
}
