import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import Button from "../components/ui/Button";
import {
	registerForPushNotificationsAsync,
	showNotification,
} from "../lib/functions";
import SettingsService from "../services/SettingsService";

export default function SettingsView() {
	const settingsService = new SettingsService();
	const [allowNotifications, setAllowNotifications] = useState(false);

	useEffect(() => {
		const loadSettings = async () => {
			try {
				const settings = await settingsService.getSettings();
				const value = settings?.allowNotifications ?? false;
				setAllowNotifications(value);
			} catch (error) {
				console.error("Failed to load settings:", error);
			}
		};
		loadSettings();
	}, []);

	const disableNotifications = async () => {
		const scheduled = await Notifications.getAllScheduledNotificationsAsync();

		for (const notification of scheduled) {
			await Notifications.cancelScheduledNotificationAsync(
				notification.identifier
			);
		}
	};

	const onValueChange = (value: boolean) => {
		setAllowNotifications(value);
		settingsService.saveSettings({
			allowNotifications: value,
		});

		if (!value) {
			disableNotifications();
		}
	};

	const handleShowNotification = () => {
		registerForPushNotificationsAsync();
		showNotification("Notification", "If you see this, notifications work!");
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.row}>
					<Text style={styles.label}>Allow notifications</Text>
					<Switch value={allowNotifications} onValueChange={onValueChange} />
					<Button
						title="Test"
						disabled={!allowNotifications}
						onPress={handleShowNotification}
					/>
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
