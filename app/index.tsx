import { useEffect } from "react";
import { View } from "react-native";
import * as Notifications from "expo-notifications";
import HomeView from "../src/views/HomeView";
import commonStyles from "../src/styles/commonStyles";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { registerForPushNotificationsAsync } from "../src/lib/functions";

export default function Home() {
	useEffect(() => {
		registerForPushNotificationsAsync();

		Notifications.scheduleNotificationAsync({
			content: {
				title: "Sadhana List",
				body: "Did you add your sadhana today?",
			},
			trigger: {
				type: SchedulableTriggerInputTypes.DAILY,
				hour: 15,
				minute: 50,
			},
		});
	}, []);

	return (
		<View style={commonStyles.homeContainer}>
			<HomeView />
		</View>
	);
}
