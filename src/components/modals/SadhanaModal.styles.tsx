import { StyleSheet } from "react-native";

const modalStyles = StyleSheet.create({
	formField: {
		gap: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	textareaField: {
		marginTop: 8,
		marginBottom: 20,
	},
	input: {
		height: 32,
		width: 40,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		fontSize: 14,
		textAlign: "center",
		color: "#333",
		backgroundColor: "#f9f9f9",
		paddingBottom: 6,
	},
	inputLabel: {
		fontSize: 17,
		fontWeight: "500",
	},
	subLabel: {
		fontSize: 15,
		fontWeight: "400",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
	},
	dayText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#666",
	},
	dateText: {
		fontSize: 20,
		fontWeight: "700",
		color: "#555",
	},
});

export default modalStyles;
