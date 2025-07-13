import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
} from "react-native";

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
	return (
		<TouchableOpacity
			style={[styles.container, containerStyle]}
			onPress={() => onChange(!value)}
			activeOpacity={0.7}
		>
			<Text style={[styles.checkbox, labelStyle]}>
				{value ? "☑️" : "⬜️"} {label}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	checkbox: {
		fontSize: 18,
	},
});

export default CheckBox;
