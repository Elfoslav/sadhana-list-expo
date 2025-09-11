import { useEffect } from "react";
import { View } from "react-native";
import HomeView from "../../src/views/HomeView";
import { scheduleNotifications } from "../../src/lib/functions";

export default function Home() {
	useEffect(() => {
		scheduleNotifications();
	}, []);

	return (
		<View>
			<HomeView />
		</View>
	);
}
