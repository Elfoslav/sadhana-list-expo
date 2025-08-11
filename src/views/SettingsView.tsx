import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import Button from "../components/ui/Button";
import {
	registerForPushNotificationsAsync,
	showNotification,
} from "../lib/functions";
import SettingsService from "../services/SettingsService";
import PinModal from "../components/PinModal";
import { usersService } from "../services/usersServiceInstance";
import { useUserStore } from "../stores/useUserStore";

export default function SettingsView() {
	const user = useUserStore((state) => state.user);
	const settingsService = new SettingsService();
	const [allowNotifications, setAllowNotifications] = useState(false);
	const [isPinModalVisible, setPinModalVisible] = useState(false);

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

	const confirmPinModal = async (pin: string) => {
		if (user) {
			usersService.savePin(user, pin);
		}

		Toast.show({
			type: "success",
			text1: "PIN changed successfully",
			position: "bottom",
		});

		closePinModal();
	};

	const openPinModal = () => {
		setPinModalVisible(true);
	};

	const closePinModal = () => {
		setPinModalVisible(false);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<View style={[styles.row, styles.spaceBetween]}>
					<Text style={styles.label}>Allow notifications</Text>
					<Switch value={allowNotifications} onValueChange={onValueChange} />
					<Button
						title="Test"
						disabled={!allowNotifications}
						onPress={handleShowNotification}
					/>
				</View>
			</View>
			{user && (
				<View style={[styles.row, styles.spaceBetween]}>
					<View>
						<Text style={styles.label}>Edit your profile PIN:</Text>
					</View>
					<Button title="Edit" onPress={openPinModal} />

					<PinModal
						user={user}
						isVisible={isPinModalVisible}
						confirmModal={confirmPinModal}
						closeModal={closePinModal}
					/>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 15,
		paddingHorizontal: 20,
	},
	content: {
		marginTop: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	spaceBetween: {
		justifyContent: "space-between",
	},
	label: {
		fontSize: 18,
	},
});
