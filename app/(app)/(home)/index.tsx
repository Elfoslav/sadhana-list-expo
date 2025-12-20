import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./home";
import OtherUsersScreen from "./other-users";
import CustomTabs from "./components/CustomTabs";

export default function TabsScreen() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const screens = [
		<HomeScreen key="home" />,
		<OtherUsersScreen key="other-users" />,
	];

	return (
		<GestureHandlerRootView style={styles.container}>
			{/* Active screen */}
			<View style={styles.screenContainer}>{screens[currentIndex]}</View>

			{/* Custom Tab Bar */}
			<CustomTabs currentIndex={currentIndex} onTabPress={setCurrentIndex} />
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	screenContainer: { flex: 1 },
});
