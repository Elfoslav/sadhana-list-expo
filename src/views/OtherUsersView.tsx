import React, { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
	View,
	StyleSheet,
	StatusBar,
	useColorScheme,
	Image,
	Alert,
	Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import commonStyles from "../styles/commonStyles";
import { usersService } from "../services/usersServiceInstance";
import Button from "../components/ui/Button";
import UserSearchSelect from "../components/UserSearchSelect";
import OtherUsersAsyncStore from "../stores/OtherUsersAsyncStore";
import User from "../models/User";
import DraggableList from "../components/DraggableList";

function OtherUsersView() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const isDarkMode = useColorScheme() === "dark";
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	useFocusEffect(
		useCallback(() => {
			// Reload users whenever screen is focused
			loadStoredUsers();
		}, [])
	);

	const loadStoredUsers = async () => {
		const storedUsers = await OtherUsersAsyncStore.getAll();
		setUsers(storedUsers);
	};

	const onDeleteUser = async (user: User) => {
		Alert.alert(
			"Delete User",
			`Are you sure you want to delete ${user.username}?`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						await OtherUsersAsyncStore.deleteUser(user.username);
						setUsers(await OtherUsersAsyncStore.getAll());
					},
				},
			],
			{ cancelable: true }
		);
	};

	const onDragEnd = async (users: User[]) => {
		console.log(users);
		await OtherUsersAsyncStore.saveUsers(users);
	};

	const checkUserData = async () => {
		if (username) {
			setIsLoading(true);
			const existingUser = await getUser(username);

			if (!existingUser) {
				Alert.alert("User does not exist", "Try to find another user");
				setIsLoading(false);
				return false;
			}
		}

		setIsLoading(false);
		return true;
	};

	const redirectToUserSadhana = (username: string) => {
		router.push({
			pathname: "/sadhana-list",
			params: { username, readOnly: "true" },
		});
	};

	const goToSadhanaList = async () => {
		if (!username) {
			Alert.alert(
				"Fill in username!",
				"Please enter your username before proceeding."
			);
			return;
		}

		const checkOk = await checkUserData();

		if (checkOk) {
			OtherUsersAsyncStore.createUser({ username, sadhanaData: [] });
			redirectToUserSadhana(username);
		}
	};

	const getSadhanaButtonText = () => {
		return isLoading ? "Configuring..." : "Show Sadhana List";
	};

	const getUser = async (username: string) => {
		// Trim username from possible trailing whitespace
		const trimmedUsername = username.trim();
		setUsername(trimmedUsername);
		console.log(username, trimmedUsername);
		const foundUser = await usersService.getRemoteUser(trimmedUsername);
		return foundUser;
	};

	return (
		<View
			style={[
				commonStyles.container,
				backgroundStyle,
				{ paddingTop: insets.top, height: "100%" },
			]}
		>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<View>
				<Text style={commonStyles.heading}>Sadhana of others</Text>
				<Image
					style={styles.logo}
					source={require("../../assets/iskcon-logo.png")}
				/>
			</View>

			<UserSearchSelect
				onChange={setUsername}
				onSelectUser={(user) => setUsername(user.username)}
				style={{ container: { marginTop: 10 } }}
			/>

			<Button
				fullWidth
				onPress={goToSadhanaList}
				title={getSadhanaButtonText()}
				size="lg"
				style={{ marginTop: 15 }}
			/>

			{users.length > 0 && (
				<DraggableList
					users={users}
					onSelectUser={(user) => redirectToUserSadhana(user.username)}
					onDeleteUser={onDeleteUser}
					onDragEnd={onDragEnd}
					variant="inline"
					style={{ marginTop: 20 }}
				/>
			)}
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

export default OtherUsersView;
