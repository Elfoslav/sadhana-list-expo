import { Stack } from "expo-router";

export default function Layout() {
	return (
		<Stack>
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
		</Stack>
	);
}
