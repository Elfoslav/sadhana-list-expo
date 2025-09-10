import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import SettingsService from "../../src/services/SettingsService";
import CryptoES from "crypto-es";

// Secret key - must be kept private
const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_PIN_ENCRYPTION_KEY;

// Encrypt a PIN (string)
export function encryptPin(pin: string): string {
  console.log(pin, ENCRYPTION_KEY);
  const encrypted = CryptoES.AES.encrypt(pin, ENCRYPTION_KEY);
  return encrypted.toString(); // returns ciphertext string (base64 by default)
}

// Decrypt the encrypted PIN
export function decryptPin(cipherText: string): string {
  const decrypted = CryptoES.AES.decrypt(cipherText, ENCRYPTION_KEY);
  return decrypted.toString(CryptoES.enc.Utf8);
}

export function dateReviver(key: string, value: any) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    // Check if the string matches the ISO 8601 date format
    return new Date(value);
  }
  return value;
}

export function formatDate(date: Date) {
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

export function getAbbreviatedDayName(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { weekday: "short" };
  const dayName = date.toLocaleDateString("en-US", options);
  return dayName.slice(0, 3);
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

export async function scheduleNotifications() {
  await registerForPushNotificationsAsync();
  const settingsService = new SettingsService();
  const settings = await settingsService.getSettings();
  const existingNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowBanner: true,
			shouldShowList: true,
			shouldPlaySound: false,
			shouldSetBadge: false,
		}),
	});

  // Avoid scheduling duplicates
  const alreadyScheduled = existingNotifications.some((n) => {
    const { trigger } = n;
    if (!trigger || typeof trigger !== "object" || !("type" in trigger))
      return false;
    return (
      trigger.type === SchedulableTriggerInputTypes.DAILY &&
      trigger.hour === 20 &&
      trigger.minute === 0
    );
  });

  const logScheduledNotifications = async () => {
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      "Scheduled notifications:",
      JSON.stringify(scheduled, null, 2)
    );
  };

  logScheduledNotifications();

  if (!alreadyScheduled && settings?.allowNotifications) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Sadhana List",
        body: "Did you add your sadhana today?",
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });
  }

  // Return updated list
  return await Notifications.getAllScheduledNotificationsAsync();
}

export async function disableNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
};