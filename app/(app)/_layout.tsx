import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Pressable, StatusBar, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../src/lib/colors";
import { setBackgroundColorAsync } from "expo-system-ui";
import Toast from "react-native-toast-message";

export default function Layout() {
	const router = useRouter();
	const isDarkMode = useColorScheme() === "dark";
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	useEffect(() => {
		// Tell Android that you're handling edge-to-edge drawing
		setBackgroundColorAsync("transparent");
	}, []);

	return (
		<SafeAreaProvider>
			<SafeAreaView
				style={{ flex: 1, backgroundColor: "#fff" }}
				edges={["bottom"]}
			>
				<StatusBar
					barStyle={isDarkMode ? "light-content" : "dark-content"}
					backgroundColor={backgroundStyle.backgroundColor}
				/>

				<Stack
					initialRouteName="(home)/index"
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
						name="(home)/index"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="pin-auth/index"
						options={{ title: "Authorization", headerRight: () => null }}
					/>
					<Stack.Screen
						name="pin-setup/index"
						options={{ title: "PIN Setup" }}
					/>
					<Stack.Screen
						name="settings/index"
						options={{ title: "Settings", headerRight: () => null }}
					/>
				</Stack>

				{/* Bottom-only safe area for overlays */}
				<Toast />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
