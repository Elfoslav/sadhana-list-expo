import { StyleSheet } from "react-native";

const modalStyles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
		justifyContent: "center",
		alignItems: "center",
	},
	centeredView: {
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		textAlign: "center",
		marginBottom: 15,
		fontSize: 18,
		fontWeight: "bold",
	},
	modalView: {
		backgroundColor: "white",
		borderRadius: 5,
		width: 300,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	formField: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 22,
	},
	input: {
		height: 38,
		width: 80,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		fontSize: 16,
		textAlign: "center",
		color: "#333",
		backgroundColor: "#f9f9f9",
	},
	buttonsWrapper: {
		flexDirection: "row", // Arrange children horizontally
		justifyContent: "space-between", // Add space between buttons
		gap: 10,
	},
	closeButton: {
		position: "absolute", // Overlay the button
		top: -20, // Adjust the top position as needed
		right: -20, // Adjust the right position as needed
		padding: 5, // Adjust the padding as needed
		borderRadius: 50, // Adjust the border radius as needed
		backgroundColor: "white",
	},
	closeButtonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
	},
	button: {
		borderRadius: 5,
		padding: 10,
		elevation: 2,
	},
	buttonConfirm: {
		backgroundColor: "#F194FF",
	},
	cancelButton: {
		backgroundColor: "gray",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
	},
});

export default modalStyles;
