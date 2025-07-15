import React, { useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
	Pressable,
	Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CheckBoxProps = {
	value: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	containerStyle?: ViewStyle;
	labelStyle?: TextStyle;
};

const CheckBox: React.FC<CheckBoxProps> = ({
	value,
	onChange,
	label = "",
	containerStyle,
	labelStyle,
}) => {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.92,
			useNativeDriver: true,
			speed: 20,
			bounciness: 8,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
			speed: 20,
			bounciness: 8,
		}).start();
	};

	return (
		<Pressable
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			onPress={() => onChange(!value)}
		>
			<Animated.View
				style={[
					styles.container,
					containerStyle,
					{ transform: [{ scale: scaleAnim }] },
				]}
			>
				<View style={[styles.checkbox, value && styles.checkedBox]}>
					{value && <Ionicons name="checkmark" size={16} color="#fff" />}
				</View>
				<Text style={[styles.label, labelStyle]}>{label}</Text>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 4,
		borderRadius: 8,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#BBB",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
		backgroundColor: "transparent",
	},
	checkedBox: {
		borderColor: "#4CAF50",
		backgroundColor: "#4CAF50",
	},
	label: {
		fontSize: 16,
		color: "#333",
	},
});

export default CheckBox;
