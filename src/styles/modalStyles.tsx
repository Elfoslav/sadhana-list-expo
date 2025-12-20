import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const modalWidth = width * 0.81;

const modalStyles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust the opacity here
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	centeredView: {
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		width: modalWidth,
		top: 20,
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#AAA",
		textAlign: "center",
		marginBottom: 15,
		backgroundColor: "#DDD",
		zIndex: 1,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
	},
	innerHeader: {
		textAlign: "center",
		marginBottom: 15,
		fontSize: 18,
		fontWeight: "bold",
	},
	modalView: {
		backgroundColor: "white",
		borderRadius: 5,
		width: modalWidth,
		padding: 25,
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
