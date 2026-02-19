import React, { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, StyleSheet, StatusBar, useColorScheme, Image, Alert, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import commonStyles from "../styles/commonStyles";
import { usersService } from "../services/usersServiceInstance";
import Button from "../components/ui/Button";
import UserSearchSelect from "../components/UserSearchSelect";
import OtherUsersStore from "../stores/OtherUsersStore";
import User from "../models/User";
import { Colors } from "../lib/colors";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { redirectToUserSadhana } from "../lib/functions";
import UsersList from "../components/UsersList";

function OtherUsersView() {
	const insets = useSafeAreaInsets();
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
		}, []),
	);

	const loadStoredUsers = async () => {
		const storedUsers = await OtherUsersStore.getAll();
		setUsers(storedUsers);
	};

	const reloadUsers = async () => {
		setUsers(await OtherUsersStore.getAll());
	};

	const deleteUser = useDeleteUser(OtherUsersStore, reloadUsers);

	const onDragEnd = async (users: User[]) => {
		console.log(users);
		await OtherUsersStore.saveUsers(users);
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

	const goToSadhanaList = async () => {
		if (!username) {
			Alert.alert("Fill in username!", "Please enter your username before proceeding.");
			return;
		}

		const checkOk = await checkUserData();

		if (checkOk) {
			OtherUsersStore.createUser({ username, sadhanaData: [] });
			redirectToUserSadhana(username, true);
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
			style={[commonStyles.container, backgroundStyle, { paddingTop: insets.top, height: "100%" }]}
		>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<View>
				<Text style={commonStyles.heading}>Sadhana of others</Text>
				<Image style={styles.logo} source={require("../../assets/iskcon-logo.png")} />
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
				disabled={!username || isLoading}
			/>

			<UsersList
				users={users}
				highlightedItem={username}
				onSelectUser={(user) => redirectToUserSadhana(user.username, true)}
				onDeleteUser={deleteUser}
				onDragEnd={onDragEnd}
			/>
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
