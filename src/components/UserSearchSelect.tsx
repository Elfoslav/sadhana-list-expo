import React, { useState, useEffect } from "react";
import commonStyles from "../../src/styles/commonStyles";
import { usersService } from "../services/usersServiceInstance";
import User from "../models/User";
import {
	View,
	TextInput,
	StyleSheet,
	ViewStyle,
	TextStyle,
	StyleProp,
	ActivityIndicator,
} from "react-native";
import DraggableList from "./DraggableList";

type UserSearchSelectProps = {
	onChange?: (value: string) => void;
	onSelectUser?: (user: User) => void;
	style?: {
		container?: StyleProp<ViewStyle>;
		input?: StyleProp<TextStyle>;
		dropdown?: StyleProp<ViewStyle>;
		dropdownItem?: StyleProp<ViewStyle>;
		dropdownItemText?: StyleProp<TextStyle>;
	};
};

export default function UserSearchSelect({
	onChange,
	onSelectUser,
	style = {},
}: UserSearchSelectProps) {
	const [searchText, setSearchText] = useState<string>("");
	const [users, setUsers] = useState<User[]>([]);
	const [userSelected, setUserSelected] = useState(false);
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	async function fetchUsers(query: string): Promise<User[]> {
		if (!query.trim()) return [];
		return await usersService.getUsers(query);
	}

	function onTextChange(text: string) {
		onChange?.(text);
		setSearchText(text);
		setUserSelected(false);
		setShowDropdown(text.length > 0);
	}

	function onUserSelect(user: User) {
		setSearchText(user.username);
		setShowDropdown(false);
		setUserSelected(true);
		onSelectUser?.(user);
	}

	// Debounced search effect
	useEffect(() => {
		if (searchText.trim() === "") {
			setUsers([]);
			setShowDropdown(false);
			setLoading(false);
			return;
		}

		const timeoutId = setTimeout(async () => {
			setLoading(true);
			let fetchedUsers = await fetchUsers(searchText);
			// Remove exact match with current input to avoid duplicates
			fetchedUsers = fetchedUsers.filter(
				(u) => u.username.toLowerCase() !== searchText.toLowerCase(),
			);
			setUsers(fetchedUsers);
			setShowDropdown(true);
			setLoading(false);
		}, 400); // delay in ms

		return () => clearTimeout(timeoutId);
	}, [searchText]);

	return (
		<View style={[styles.container, style.container]}>
			<TextInput
				placeholder="Search users"
				value={searchText}
				onChangeText={onTextChange}
				style={[commonStyles.textInput, style.input]}
			/>

			{loading && <ActivityIndicator size="small" color="#555" style={styles.loadingIndicator} />}

			{showDropdown && !userSelected && !loading && users.length > 0 && (
				<DraggableList users={users} onSelectUser={onUserSelect} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		position: "relative",
		zIndex: 1,
	},
	loadingIndicator: {
		position: "absolute",
		right: 10,
		top: 12,
	},
});
