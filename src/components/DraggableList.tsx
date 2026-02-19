import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import User from "../models/User";

type Props = {
	users: User[];
	onSelectUser: (user: User) => void;
	onDeleteUser?: (user: User) => void;
	onDragEnd?: (users: User[]) => void;
	variant?: "dropdown" | "inline";
	style?: ViewStyle;
};

export default function DraggableList({
	users,
	onSelectUser,
	onDeleteUser,
	onDragEnd,
	variant = "dropdown",
	style,
}: Props) {
	const [data, setData] = useState<User[]>(users);

	useEffect(() => {
		setData(users); // sync with prop changes
	}, [users]);

	const handleDragEnd = async ({ data }: { data: User[] }) => {
		setData(data);

		// Persist the new order
		try {
			onDragEnd && onDragEnd(data);
		} catch (error) {
			console.error("Failed to save reordered users", error);
		}
	};

	const renderItem = ({ item, drag, isActive }: RenderItemParams<User>) => (
		<View style={[styles.itemContainer, isActive && { backgroundColor: "#eee" }]}>
			<TouchableOpacity style={styles.itemTextContainer} onPress={() => onSelectUser(item)}>
				<Text style={styles.dropdownItemText}>{item.username}</Text>
			</TouchableOpacity>

			{variant === "inline" && onDragEnd && (
				<TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
					<Text style={styles.dragIcon}>☰</Text>
				</TouchableOpacity>
			)}

			{variant === "inline" && onDeleteUser && (
				<TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteUser(item)}>
					<Text style={styles.deleteButtonText}>❌</Text>
				</TouchableOpacity>
			)}
		</View>
	);

	return (
		<DraggableFlatList
			data={data}
			keyExtractor={(item) => item.username}
			renderItem={renderItem}
			onDragEnd={handleDragEnd}
			style={[variant === "dropdown" ? styles.dropdown : styles.inline, style]}
			scrollEnabled={true}
			autoscrollThreshold={50} // distance from edge to start autoscroll
			autoscrollSpeed={50}
			contentContainerStyle={{ paddingBottom: 0 }}
		/>
	);
}

const styles = StyleSheet.create({
	dropdown: {
		left: 0,
		right: 0,
		maxHeight: 203,
		borderColor: "#aaa",
		borderWidth: 1,
		borderRadius: 4,
		backgroundColor: "#fff",
		elevation: 10,
	},
	inline: {
		borderColor: "#aaa",
		borderWidth: 1,
		borderRadius: 4,
		backgroundColor: "#fff",
		maxHeight: 300,
		minHeight: 50,
	},
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderBottomColor: "#ddd",
		borderBottomWidth: 1,
	},
	itemTextContainer: {
		flex: 1,
	},
	dropdownItemText: {
		fontSize: 16,
	},
	dragHandle: {
		paddingHorizontal: 2,
		justifyContent: "center",
		alignItems: "center",
	},

	dragIcon: {
		fontSize: 20,
	},
	deleteButton: {
		marginLeft: 10,
	},
	deleteButtonText: {
		fontSize: 16,
		color: "red",
	},
});
