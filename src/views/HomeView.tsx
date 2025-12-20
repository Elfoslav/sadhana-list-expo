import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, TextInput, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import commonStyles from "../styles/commonStyles";
import { useBootstrapUser } from "../hooks/useBootstrapUser";
import { usersService } from "../services/usersServiceInstance";
import Button from "../components/ui/Button";

function HomeView() {
	const insets = useSafeAreaInsets();
	const { bootstrap, isLoading } = useBootstrapUser();
	const [username, setUsername] = useState("");
	const hasBootstrappedRef = useRef(false);

	// Load username from storage once
	useEffect(() => {
		const loadUsername = async () => {
			const stored = await usersService.getUsername();
			if (stored) setUsername(stored);
		};
		loadUsername();
	}, []);

	const getSadhanaButtonText = () => {
		return isLoading ? "Configuring..." : "Show Sadhana List";
	};

	// Automatically bootstrap once after username is loaded
	useEffect(() => {
		if (!username) return; // wait until username is set
		if (hasBootstrappedRef.current) return;

		hasBootstrappedRef.current = true;
		bootstrap(username);
	}, [username, bootstrap]);

	return (
		<View
			style={[
				commonStyles.container,
				{ paddingTop: insets.top, height: "100%" },
			]}
		>
			<View>
				<Text style={commonStyles.heading}>My Sadhana</Text>
				<Image
					style={styles.logo}
					source={require("../../assets/iskcon-logo.png")}
				/>
				<TextInput
					style={[commonStyles.textInput, { marginTop: 10 }]}
					value={username}
					placeholder="Your name"
					autoCorrect={false}
					onChangeText={setUsername}
				/>

				<Button
					fullWidth
					onPress={() => bootstrap(username, true)}
					title={getSadhanaButtonText()}
					size="lg"
					style={{ marginTop: 15 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	centerText: {
		textAlign: "center",
		fontSize: 18,
	},
	logo: {
		width: "100%", // Set the width to 100%
		height: 220, // Set the height (adjust as needed)
	},
});

export default HomeView;
