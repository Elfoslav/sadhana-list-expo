import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import User from "../../models/User";

type DeleteUserModalProps = {
	visible: boolean;
	user: User | null;
	onCancel: () => void;
	onConfirm: () => void;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
	visible,
	user,
	onCancel,
	onConfirm,
}) => {
	if (!user) return null;

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<Text style={styles.title}>Delete User</Text>

					<Text style={styles.message}>
						Are you sure you want to delete <Text style={styles.bold}>{user.username}</Text> from
						the list?
					</Text>

					<Text style={styles.subMessage}>(It will not delete user from the database)</Text>

					<View style={styles.actions}>
						<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
							<Text style={styles.cancelText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onConfirm}>
							<Text style={styles.deleteText}>Delete</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},

	modal: {
		width: width * 0.89,
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 20,
	},

	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},

	message: {
		fontSize: 16,
		marginBottom: 8,
	},

	subMessage: {
		fontSize: 14,
		color: "#555",
		marginBottom: 20,
	},

	bold: {
		fontWeight: "bold",
	},

	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
	},

	button: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 6,
	},

	cancelButton: {
		backgroundColor: "#eee",
	},

	deleteButton: {
		backgroundColor: "#ff4d4f",
	},

	cancelText: {
		color: "#333",
		fontWeight: "bold",
	},

	deleteText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

export default DeleteUserModal;
