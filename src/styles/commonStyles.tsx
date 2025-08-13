import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1,
		gap: 10,
		padding: 20,
	},
	container: {
		padding: 20,
	},
	centeredView: {
		justifyContent: "center",
		alignItems: "center",
	},
	flexRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 15,
	},
	textInput: {
		borderColor: "#aaa",
		borderWidth: 1,
		padding: 10,
		borderRadius: 4,
		backgroundColor: "#fff",
	},
	numericInput: {
		width: 30,
		height: 28,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
	},
	textArea: {
		flex: 1,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10,
		height: 100,
	},
	btnLg: {
		height: 40,
	},
	touchableBtnLg: {
		flexDirection: "row",
		height: 40,
		backgroundColor: "#007AFF",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 3,
		elevation: 3,
	},
	touchableBtnText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "white",
	},
	textBold: {
		fontWeight: "bold",
	},
	fontSizeMd: {
		fontSize: 16,
	},
});

export default styles;
