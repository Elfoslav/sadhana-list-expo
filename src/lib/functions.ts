import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

export function dateReviver(key: string, value: any) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    // Check if the string matches the ISO 8601 date format
    return new Date(value);
  }
  return value;
}

export async function registerForPushNotificationsAsync() {
		const { status } = await Notifications.requestPermissionsAsync();
		if (status !== "granted") {
			alert("Permission to receive notifications was denied");
			return;
		}

		// Optional: Get push token for remote notifications
		// const token = (await Notifications.getExpoPushTokenAsync()).data;
		// console.log(token);

		// For Android
		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.HIGH,
			});
		}
	}

export async function showNotification(title: string, body: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}