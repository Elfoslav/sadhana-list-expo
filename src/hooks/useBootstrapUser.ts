import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAppState } from "../stores/useAppState";
import { useUserStore } from "../stores/useUserStore";
import { usersService } from "../services/usersServiceInstance";
import SettingsService from "../services/SettingsService";
import User from "../models/User";

export function useBootstrapUser() {
	const router = useRouter();
	const settingsService = new SettingsService();
	const setUser = useUserStore((state) => state.setUser);
	const setRemoteUser = useUserStore((state) => state.setRemoteUser);
	const storeRemoteUser = useUserStore((state) => state.remoteUser);
	const setLocalUser = useUserStore((state) => state.setLocalUser);
	const storeLocalUser = useUserStore((state) => state.localUser);
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
		manualRedirect = false
	) => {
		// Defer navigation to next tick
		setTimeout(() => {
			if (
				(!localUser?.pin && remoteUser?.pin) ||
				localUser?.pin !== remoteUser?.pin
			) {
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
		}, 0);
	};

	const bootstrap = useCallback(
		async (username?: string, manualRedirect = false) => {
			if (!hasMounted.current || !username) return;
			setIsLoading(true);
			const trimmedUsername = username.trim();
			await usersService.saveUsername(trimmedUsername);

			if (
				storeLocalUser &&
				storeRemoteUser &&
				trimmedUsername === storeLocalUser.username
			) {
				return forwardNextScreen(
					storeLocalUser,
					storeRemoteUser,
					trimmedUsername,
					manualRedirect
				);
			}

			const localUser = await usersService.getLocalUser(trimmedUsername);
			const remoteUser = await usersService.getUser(trimmedUsername);

			// Merge users: pick the latest
			let finalUser = localUser;
			if (!finalUser) finalUser = remoteUser;
			else if (
				remoteUser &&
				remoteUser.updatedAt &&
				finalUser.updatedAt &&
				remoteUser.updatedAt > finalUser.updatedAt
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
		[router, setUser, redirectedToSadhana, setRedirectedToSadhana]
	);

	return { bootstrap, isLoading };
}
