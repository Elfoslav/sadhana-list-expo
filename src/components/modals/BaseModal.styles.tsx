import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const modalWidth = width * 0.99;

const modalStyles = StyleSheet.create({
	headerBar: {
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 40,
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
		top: 25,
		textAlign: "center",
		zIndex: 1,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
	},
	closeIcon: {
		position: "absolute",
		top: 64,
		right: 16,
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
});

export default modalStyles;
