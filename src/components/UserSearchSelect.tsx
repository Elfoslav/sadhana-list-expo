import React, { useState, useEffect } from "react";
import commonStyles from "../../src/styles/commonStyles";
import { usersService } from "../services/usersServiceInstance";
import User from "../models/User";
import {
	View,
	TextInput,
	FlatList,
	Text,
	TouchableOpacity,
	StyleSheet,
	ViewStyle,
	TextStyle,
	StyleProp,
} from "react-native";

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
			return;
		}

		const timeoutId = setTimeout(async () => {
			const fetchedUsers = await fetchUsers(searchText);
			setUsers(fetchedUsers);
			setShowDropdown(true);
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

			{showDropdown && !userSelected && users.length > 0 && (
				<FlatList
					style={[styles.dropdown, style.dropdown]}
					data={users}
					keyExtractor={(item) => item.username}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => onUserSelect(item)}
							style={[styles.dropdownItem, style.dropdownItem]}
						>
							<Text style={[styles.dropdownItemText, style.dropdownItemText]}>
								{item.username}
							</Text>
						</TouchableOpacity>
					)}
					keyboardShouldPersistTaps="handled"
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		position: "relative",
	},
	dropdown: {
		position: "absolute",
		top: 52,
		left: 0,
		right: 0,
		maxHeight: 200,
		borderColor: "#aaa",
		borderWidth: 1,
		borderRadius: 4,
		backgroundColor: "#fff",
		zIndex: 1000,
		overflow: "scroll",
	},
	dropdownItem: {
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
	},
	dropdownItemText: {
		fontSize: 16,
	},
	notFoundText: {
		fontStyle: "italic",
		color: "#999",
	},
});
