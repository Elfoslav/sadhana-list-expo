import { View, Text, Alert } from "react-native";
import commonStyles from "@/src/styles/commonStyles";
import PinInput from "@/src/components/PinInput";
import { useState } from "react";
import Button from "@/src/components/ui/Button";
import { router } from "expo-router";
import { usersService } from "@/src/services/usersServiceInstance";
import { useUserStore } from "@/src/stores/useUserStore";
import { decryptPin, encryptPin } from "@/src/lib/functions";

export default function PinSetup() {
	const user = useUserStore((state) => state.user);
	const [pin, setPin] = useState("");

	const checkPin = () => {
		if (pin.length !== 4) {
			Alert.alert("Invalid PIN", "Enter 4-digit PIN.");
			return;
		}

		const decryptedPin = decryptPin(user?.pin || "");
		if (decryptedPin === pin) {
			if (user) {
				usersService.savePin(user, pin);
			}

			router.replace({
				pathname: "/sadhana-list",
				params: { username: user?.username },
			});
		} else {
			Alert.alert("Invalid PIN", "Wrong PIN");
		}
	};

	return (
		<View style={[commonStyles.container, commonStyles.centeredView]}>
			<Text style={commonStyles.fontSizeMd}>
				The "<Text style={commonStyles.textBold}>{user?.username}"</Text>{" "}
				account is protected
			</Text>
			<Text
				style={[
					commonStyles.textBold,
					commonStyles.fontSizeMd,
					{ marginBottom: 15 },
				]}
			>
				Enter your PIN
			</Text>
			<PinInput value={pin} onChange={setPin} />

			<Button
				onPress={checkPin}
				title="Submit"
				size="lg"
				style={{ marginBottom: 10 }}
				fullWidth
			/>
		</View>
	);
}
