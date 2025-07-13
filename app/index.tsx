import { View } from "react-native";
import HomeView from "../src/views/HomeView";
import commonStyles from "../src/styles/commonStyles";

export default function Home() {
	return (
		<View style={commonStyles.homeContainer}>
			<HomeView />
		</View>
	);
}
