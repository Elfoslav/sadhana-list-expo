import { Alert } from "react-native";
import User from "../models/User";

type UsersStore = {
	deleteUser: (username: string) => Promise<void>;
};

export const useDeleteUser = (store: UsersStore, reloadUsers: () => Promise<void>) => {
	const deleteUser = (user: User) => {
		Alert.alert(
			"Delete User",
			`Are you sure you want to delete ${user.username}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						await store.deleteUser(user.username);
						await reloadUsers();
					},
				},
			],
			{ cancelable: true },
		);
	};

	return deleteUser;
};
