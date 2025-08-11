import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { setBackgroundColorAsync } from "expo-system-ui";

export default function Layout() {
	const router = useRouter();
	useEffect(() => {
		// Tell Android that you're handling edge-to-edge drawing
		setBackgroundColorAsync("transparent");
	}, []);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#fff" }}
			edges={["top", "bottom"]}
		>
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: "#fff",
					},
					headerTintColor: "#444",
					headerTitleStyle: {
						fontWeight: "bold",
					},
					headerRight: () => (
						<Pressable onPress={() => router.push("/settings")}>
							<Ionicons name="settings-outline" size={22} color="black" />
						</Pressable>
					),
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						title: "Sadhana List App",
					}}
				/>
				<Stack.Screen
					name="pin-auth/index"
					options={{
						title: "Authorization",
						headerRight: () => null,
					}}
				/>
				<Stack.Screen
					name="pin-setup/index"
					options={{
						title: "PIN Setup",
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
						headerRight: () => null,
					}}
				/>
			</Stack>
		</SafeAreaView>
	);
}
