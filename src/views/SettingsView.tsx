import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import type { NotificationRequest } from "expo-notifications";
import Button from "../components/ui/Button";
import {
	registerForPushNotificationsAsync,
	showNotification,
	scheduleNotifications,
	disableNotifications,
} from "../lib/functions";
import SettingsService from "../services/SettingsService";
import PinModal from "../components/modals/PinModal";
import { usersService } from "../services/usersServiceInstance";
import { useUserStore } from "../stores/useUserStore";

function isDailyTrigger(
	trigger: Notifications.NotificationTrigger | null
): trigger is Notifications.DailyTriggerInput {
	// check that trigger is an object and has type 'daily'
	return (
		!!trigger &&
		typeof trigger === "object" &&
		"type" in trigger &&
		trigger.type === "daily"
	);
}

export default function SettingsView() {
	const user = useUserStore((state) => state.user);
	const settingsService = new SettingsService();
	const [allowNotifications, setAllowNotifications] = useState(false);
	const [isPinModalVisible, setPinModalVisible] = useState(false);
	const [existingNotifications, setExistingNotifications] = useState<
		NotificationRequest[]
	>([]);

	const loadExistingNotifications = async () => {
		const scheduled = await Notifications.getAllScheduledNotificationsAsync();
		setExistingNotifications(scheduled);
		return scheduled;
	};

	useEffect(() => {
		loadExistingNotifications();
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

	useEffect(() => {
		console.log("existingNotifications updated:", existingNotifications);
	}, [existingNotifications]);

	const onValueChange = async (value: boolean) => {
		setAllowNotifications(value);
		settingsService.saveSettings({
			allowNotifications: value,
		});

		if (value) {
			const scheduled = await scheduleNotifications();
			setExistingNotifications(scheduled);
		} else {
			await disableNotifications();
			await loadExistingNotifications();
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
				{existingNotifications.map((notification) => {
					const trigger = notification.trigger;
					if (!isDailyTrigger(trigger)) return null;
					return (
						<View key={notification.identifier} style={styles.row}>
							<Text style={styles.textGray}>
								Notification "{notification.content.title}" scheduled at{" "}
								{trigger.hour}:{trigger.minute.toString().padStart(2, "0")}
							</Text>
						</View>
					);
				})}
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
		marginBottom: 5,
	},
	spaceBetween: {
		justifyContent: "space-between",
	},
	label: {
		fontSize: 18,
	},
	textGray: {
		color: "gray",
	},
});
