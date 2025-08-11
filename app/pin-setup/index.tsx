import { View, Text, Alert } from "react-native";
import commonStyles from "../../src/styles/commonStyles";
import PinInput from "../../src/components/PinInput";
import { useState } from "react";
import Button from "../../src/components/ui/Button";
import { router } from "expo-router";
import { usersService } from "../../src/services/usersServiceInstance";
import { useUserStore } from "../../src/stores/useUserStore";

export default function PinSetup() {
	const user = useUserStore((state) => state.user);
	const [pin, setPin] = useState("");

	const savePin = () => {
		if (pin.length !== 4) {
			Alert.alert("Invalid PIN", "Enter 4-digit PIN.");
			return;
		}
		user && usersService.savePin(user, pin);
		router.replace({
			pathname: "/sadhana-list",
			params: { username: user?.username },
		});
	};

	return (
		<View style={[commonStyles.container, commonStyles.centeredView]}>
			<Text style={commonStyles.fontSizeMd}>
				To protect your{" "}
				<Text style={commonStyles.textBold}>{user?.username}</Text> account
			</Text>
			<Text
				style={[
					commonStyles.textBold,
					commonStyles.fontSizeMd,
					{ marginBottom: 15 },
				]}
			>
				Setup your PIN
			</Text>
			<PinInput value={pin} onChange={setPin} />
			<Text>You can see and change the PIN later in the settings</Text>
			<Text style={{ marginBottom: 20 }}>
				If you forget your PIN, you will lose your account
			</Text>

			<Button
				onPress={savePin}
				title="Submit"
				size="lg"
				style={{ marginBottom: 10 }}
				fullWidth
			/>

			<Button
				onPress={() => {
					router.replace({
						pathname: "/sadhana-list",
						params: { username: user?.username },
					});
				}}
				title="Skip"
				variant="secondary"
				size="lg"
				fullWidth
			/>
		</View>
	);
}
