import { useEffect } from "react";
import { View } from "react-native";
import * as Notifications from "expo-notifications";
import HomeView from "../src/views/HomeView";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { registerForPushNotificationsAsync } from "../src/lib/functions";

export default function Home() {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowBanner: true,
			shouldShowList: true,
			shouldPlaySound: false,
			shouldSetBadge: false,
		}),
	});

	useEffect(() => {
		(async () => {
			await registerForPushNotificationsAsync();

			const existing = await Notifications.getAllScheduledNotificationsAsync();

			// Avoid scheduling duplicates
			const alreadyScheduled = existing.some((n) => {
				const { trigger } = n;
				if (!trigger || typeof trigger !== "object" || !("type" in trigger))
					return false;
				return (
					trigger.type === SchedulableTriggerInputTypes.DAILY &&
					trigger.hour === 20 &&
					trigger.minute === 0
				);
			});

			if (!alreadyScheduled) {
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
		})();
	}, []);

	return (
		<View>
			<HomeView />
		</View>
	);
}
