import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const modalWidth = width * 0.99;

const modalStyles = StyleSheet.create({
	headerBar: {
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 55,
		paddingBottom: 40,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		backgroundColor: "white",
	},
	centeredView: {
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		width: modalWidth,
		top: 40,
		textAlign: "center",
		marginBottom: 15,
		zIndex: 1,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
	},
	closeIcon: {
		position: "absolute",
		top: 95,
		right: 15,
		zIndex: 10,
		elevation: 10,
	},
	innerHeader: {
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold",
	},
	modalView: {
		backgroundColor: "white",
		width: modalWidth,
		height: "100%",
		padding: 25,
	},
	footer: {
		flexDirection: "row", // Arrange children horizontally
		justifyContent: "space-between", // Add space between buttons
		gap: 10,
	},
	buttonsWrapper: {
		flexDirection: "row", // Arrange children horizontally
		justifyContent: "space-between", // Add space between buttons
		width: "100%",
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
});

export default modalStyles;
