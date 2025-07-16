import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import Button from "../components/ui/Button";
import {
	registerForPushNotificationsAsync,
	showNotification,
} from "../lib/functions";
import SettingsService from "../services/SettingsService";

export default function SettingsView() {
	const router = useRouter();
	const settingsService = new SettingsService();
	const [allowNotifications, setAllowNotifications] = useState(false);
	const [originalValue, setOriginalValue] = useState(false); // for cancel reset

	useEffect(() => {
		const loadSettings = async () => {
			try {
				const settings = await settingsService.getSettings();
				const value = settings?.allowNotifications ?? false;
				setAllowNotifications(value);
				setOriginalValue(value);
			} catch (error) {
				console.error("Failed to load settings:", error);
			}
		};
		loadSettings();
	}, []);

	const handleSubmit = () => {
		settingsService.saveSettings({
			allowNotifications: allowNotifications,
		});

		Alert.alert(
			"Settings Saved",
			`Notifications: ${allowNotifications ? "Enabled" : "Disabled"}`
		);

		router.back();
	};

	const handleShowNotification = () => {
		registerForPushNotificationsAsync();
		showNotification("Notification", "If you see this, notifications work!");
	};

	const handleCancel = () => {
		setAllowNotifications(originalValue);
		router.back();
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.row}>
					<Text style={styles.label}>Allow notifications</Text>
					<Switch
						value={allowNotifications}
						onValueChange={setAllowNotifications}
					/>
					<Button
						title="Test"
						disabled={!allowNotifications}
						onPress={handleShowNotification}
					/>
				</View>
			</View>

			<View style={styles.buttonRow}>
				<View style={styles.buttonContainer}>
					<Button title="Submit" onPress={handleSubmit} />
				</View>
				<View style={styles.buttonContainer}>
					<Button title="Cancel" variant="secondary" onPress={handleCancel} />
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 15,
		paddingHorizontal: 20,
	},
	content: {
		flex: 1,
		justifyContent: "space-between",
		marginTop: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	label: {
		fontSize: 18,
	},
	buttonRow: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
	},
	buttonContainer: {
		flex: 1,
	},
});
