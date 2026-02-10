import React from "react";
import { useRouter } from "expo-router";
import User from "../models/User";
import DraggableList from "./DraggableList";
import { View } from "react-native";

type UsersListPropps = {
	users: User[];
	onSelectUser: (user: User) => void;
	onDeleteUser: (user: User) => void;
	onDragEnd: (users: User[]) => void;
};

export default function UsersList({
	users,
	onSelectUser,
	onDeleteUser,
	onDragEnd,
}: UsersListPropps) {
	const router = useRouter();

	return (
		<>
			{users.length > 0 && (
				<View style={{ marginTop: 20 }}>
					<DraggableList
						users={users}
						onSelectUser={onSelectUser}
						onDeleteUser={onDeleteUser}
						onDragEnd={onDragEnd}
						variant="inline"
					/>
				</View>
			)}
		</>
	);
}
