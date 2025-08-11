import {
	Modal,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	Text,
	StyleSheet,
	Alert,
} from "react-native";
import Button from "./ui/Button";
import modalStyles from "../styles/modalStyles";
import { useState, useRef, useEffect } from "react";
import PinInput from "./PinInput";
import User from "../models/User";
import { decryptPin } from "../lib/functions";

interface PinModalProps {
	isVisible: boolean;
	user: User | null;
	confirmModal: (pin: string) => void;
	closeModal: () => void;
}

const PinModal: React.FC<PinModalProps> = ({
	isVisible,
	user,
	confirmModal,
	closeModal,
}) => {
	const [pin, setPin] = useState<string>("");
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (user) {
			setPin(decryptPin(user.pin || ""));
		}
	}, [user]);

	const handleConfirm = () => {
		if (pin.length !== 4) {
			Alert.alert("Invalid PIN", "Enter 4-digit PIN.");
			return;
		}

		confirmModal(pin);
	};

	return (
		<Modal visible={isVisible} transparent animationType="fade">
			<TouchableOpacity
				style={modalStyles.modalBackground}
				activeOpacity={1}
				onPressOut={closeModal}
			>
				<View style={modalStyles.centeredView}>
					<TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
						<View style={modalStyles.modalView}>
							<Text style={modalStyles.header}>Enter PIN</Text>

							<PinInput value={pin} onChange={setPin} />

							<View style={modalStyles.buttonsWrapper}>
								<Button
									style={modalStyles.button}
									onPress={handleConfirm}
									title="Confirm"
								/>
								<Button
									style={[modalStyles.button, modalStyles.cancelButton]}
									onPress={closeModal}
									title="Cancel"
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	boxesWrapper: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
		marginBottom: 20,
	},
	box: {
		width: 48,
		height: 56,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#aaa",
		justifyContent: "center",
		alignItems: "center",
	},
	boxText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#000",
	},
	hiddenInput: {
		position: "absolute",
		opacity: 0,
	},
});

export default PinModal;
