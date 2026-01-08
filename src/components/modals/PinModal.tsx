import {
	TextInput,
	TouchableWithoutFeedback,
	View,
	Text,
	Alert,
} from "react-native";
import Button from "../ui/Button";
import { useState, useRef, useEffect } from "react";
import PinInput from "../PinInput";
import User from "../../models/User";
import { decryptPin } from "../../lib/functions";
import BaseModal from "./BaseModal";
import baseModalStyles from "./BaseModal.styles";

const BUTTON_WIDTH = "47%";

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
		<BaseModal
			isVisible={isVisible}
			onClose={closeModal}
			title={
				<Text style={[baseModalStyles.header, baseModalStyles.innerHeader]}>
					Enter PIN
				</Text>
			}
			footer={
				<View style={baseModalStyles.buttonsWrapper}>
					<Button
						style={{ width: BUTTON_WIDTH }}
						size="lg"
						onPress={handleConfirm}
						title="Confirm"
					/>
					<Button
						style={{ width: BUTTON_WIDTH }}
						size="lg"
						variant="secondary"
						onPress={closeModal}
						title="Cancel"
					/>
				</View>
			}
		>
			<View style={baseModalStyles.centeredView}>
				<TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
					<PinInput value={pin} onChange={setPin} />
				</TouchableWithoutFeedback>
			</View>
		</BaseModal>
	);
};

export default PinModal;
