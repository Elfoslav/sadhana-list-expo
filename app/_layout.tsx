import { Stack, useRouter, usePathname } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
	const router = useRouter();
	const pathname = usePathname();
	// Hide settings icon on the settings page
	const showSettingsButton = pathname !== "/settings";
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "#fff",
				},
				headerTintColor: "#444",
				headerTitleStyle: {
					fontWeight: "bold",
				},
				headerRight: () =>
					showSettingsButton ? (
						<Pressable onPress={() => router.push("/settings")}>
							<Ionicons name="settings-outline" size={20} color="black" />
						</Pressable>
					) : null,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Sadhana List App",
				}}
			/>
			<Stack.Screen
				name="sadhana-list/index"
				options={{
					title: "Sadhana List",
				}}
			/>
			<Stack.Screen
				name="settings/index"
				options={{
					title: "Settings",
				}}
			/>
		</Stack>
	);
}
