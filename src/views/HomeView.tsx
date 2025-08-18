import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
	View,
	StyleSheet,
	StatusBar,
	useColorScheme,
	Image,
	TextInput,
	Alert,
	Text,
} from "react-native";
import commonStyles from "../styles/commonStyles";
import SettingsService from "../services/SettingsService";
import { usersService } from "../services/usersServiceInstance";
import { useUserStore } from "../stores/useUserStore";
import Button from "../components/ui/Button";

function HomeView() {
	const router = useRouter();
	const settingsService = new SettingsService();
	const setUser = useUserStore((state) => state.setUser);
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const isDarkMode = useColorScheme() === "dark";
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	const checkUserData = async (username: string) => {
		if (username) {
			setIsLoading(true);
			const localUser = await usersService.getLocalUser(username);
			localUser && setUser(localUser);
			await usersService.saveUsername(username);
			const existingUser = await getUser(username);
			// Rewrite localUser
			existingUser && setUser(existingUser);

			if (!existingUser) {
				// create user
				const newUser = await usersService.createUser({
					username,
					sadhanaData: [],
				});

				newUser && setUser(newUser);

				// Create default settings
				settingsService.createSettings({
					allowNotifications: true, // default notifications - true
				});
			}

			if (
				(!localUser?.pin && existingUser?.pin) ||
				localUser?.pin !== existingUser?.pin
			) {
				await usersService.saveUsername(username);
				router.push({
					pathname: "/pin-auth",
					params: { username },
				});
				setIsLoading(false);
				return;
			}

			if (!localUser?.pin && !existingUser?.pin) {
				await usersService.saveUsername(username);
				router.push({
					pathname: "/pin-setup",
					params: { username },
				});
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			return true;
		}

		return false;
	};

	const goToSadhanaList = async (username: string) => {
		if (!username) {
			Alert.alert(
				"Fill in username!",
				"Please enter your username before proceeding."
			);
			return;
		}

		const checkOk = await checkUserData(username);

		if (checkOk) {
			router.push({
				pathname: "/sadhana-list",
				params: { username },
			});
		}
	};

	const getSadhanaButtonText = () => {
		return isLoading ? "Configuring..." : "Show Sadhana List";
	};

	const getUser = async (username: string) => {
		// Trim username from possible trailing whitespace
		const trimmedUsername = username.trim();
		setUsername(trimmedUsername);
		const foundUser = await usersService.getUser(trimmedUsername);
		return foundUser;
	};

	const setupUsername = async () => {
		const foundUsername = await usersService.getUsername();
		foundUsername && setUsername(foundUsername);
		return foundUsername;
	};

	const onShow = async () => {
		const foundUsername = await setupUsername();
		const checkOk = await checkUserData(foundUsername || "");
		checkOk && goToSadhanaList(foundUsername || "");
	};

	useEffect(() => {
		onShow();
	}, []);

	return (
		<View style={[commonStyles.container, backgroundStyle]}>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<View>
				<Text style={commonStyles.heading}>My Sadhana</Text>
				<Image
					style={styles.logo}
					source={require("../../assets/iskcon-logo.png")}
				/>
				<TextInput
					style={[commonStyles.textInput, { marginTop: 10 }]}
					value={username}
					placeholder="Your name"
					autoCorrect={false}
					onChangeText={setUsername}
				/>

				<Button
					fullWidth
					onPress={() => goToSadhanaList(username)}
					title={getSadhanaButtonText()}
					size="lg"
					style={{ marginTop: 15 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	centerText: {
		textAlign: "center",
		fontSize: 18,
	},
	logo: {
		width: "100%", // Set the width to 100%
		height: 220, // Set the height (adjust as needed)
	},
});

export default HomeView;
