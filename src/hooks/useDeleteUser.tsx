import { useState } from "react";
import User from "../models/User";
import DeleteUserModal from "../components/modals/DeleteUserModal";

type UsersStore = {
	deleteUser: (username: string) => Promise<void>;
};

export const useDeleteUser = (store: UsersStore, reloadUsers: () => Promise<void>) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	// Call this to start the deletion process
	const promptDeleteUser = (user: User) => {
		setSelectedUser(user);
		setModalVisible(true);
	};

	// The modal component to render in your tree
	const deleteModal = (
		<DeleteUserModal
			visible={modalVisible}
			user={selectedUser}
			onCancel={() => setModalVisible(false)}
			onConfirm={async () => {
				if (selectedUser) {
					await store.deleteUser(selectedUser.username);
					await reloadUsers();
				}
				setModalVisible(false);
			}}
		/>
	);

	return { promptDeleteUser, deleteModal };
};
