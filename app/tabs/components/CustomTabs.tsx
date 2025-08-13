import React, { useRef, useEffect } from "react";
import {
	View,
	TouchableOpacity,
	Animated,
	StyleSheet,
	Text,
	Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const TABS = [
	{ label: "My Sadhana", icon: "person" },
	{ label: "Other Users", icon: "group" },
];

type CustomTabsProps = {
	currentIndex: number;
	onTabPress: (index: number) => void;
};

export default function CustomTabs({
	currentIndex,
	onTabPress,
}: CustomTabsProps) {
	const anim = useRef(new Animated.Value(currentIndex)).current;
	const width = Dimensions.get("window").width / TABS.length;

	useEffect(() => {
		Animated.spring(anim, {
			toValue: currentIndex,
			useNativeDriver: true,
		}).start();
	}, [currentIndex]);

	const translateX = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, width],
	});

	return (
		<View style={styles.container}>
			{/* Sliding background */}
			<Animated.View
				style={[
					styles.slider,
					{
						width,
						transform: [{ translateX }],
					},
				]}
			/>

			{/* Tabs */}
			{TABS.map((tab, index) => {
				const isFocused = index === currentIndex;
				return (
					<TouchableOpacity
						key={tab.label}
						style={styles.tabButton}
						onPress={() => onTabPress(index)}
					>
						<MaterialIcons
							name={tab.icon as any}
							size={24}
							color={isFocused ? "#007bff" : "#888"}
						/>
						<Text
							style={[styles.label, { color: isFocused ? "#007bff" : "#888" }]}
						>
							{tab.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		height: 60,
		borderTopWidth: 1,
		borderColor: "#ddd",
		backgroundColor: "#fff",
		position: "relative",
	},
	tabButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	slider: {
		position: "absolute",
		height: "100%",
		backgroundColor: "#e6f0ff",
		top: 0,
		left: 0,
	},
	label: {
		fontSize: 12,
		marginTop: 2,
		fontWeight: "600",
	},
});
