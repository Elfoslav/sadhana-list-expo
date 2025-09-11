import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

type DurationPickerProps = {
	value: number; // total minutes
	disabled?: boolean;
	onChange: (minutes: number) => void;
};

export default function DurationPicker({
	value = 0,
	disabled,
	onChange,
}: DurationPickerProps) {
	const [hours, setHours] = useState(Math.floor(value / 60).toString());
	const [minutes, setMinutes] = useState((value % 60).toString());

	// Sync local state when value prop changes
	useEffect(() => {
		setHours(Math.floor(value / 60).toString());
		setMinutes((value % 60).toString());
	}, [value]);

	const clamp = (val: number, min: number, max: number) =>
		Math.min(Math.max(val, min), max);

	const handleHoursChange = (text: string) => {
		if (text === "") {
			setHours("");
			return;
		}

		const h = parseInt(text);
		if (!isNaN(h)) {
			setHours(text);
			onChange(clamp(h, 0, 23) * 60 + (parseInt(minutes) || 0));
		}
	};

	const handleHoursBlur = () => {
		const h = parseInt(hours) || 0;
		const clamped = clamp(h, 0, 23);
		setHours(clamped.toString());
		onChange(clamped * 60 + (parseInt(minutes) || 0));
	};

	const handleMinutesChange = (text: string) => {
		if (text === "") {
			setMinutes("");
			return;
		}

		const m = parseInt(text);
		if (!isNaN(m)) {
			setMinutes(text);
			onChange((parseInt(hours) || 0) * 60 + clamp(m, 0, 59));
		}
	};

	const handleMinutesBlur = () => {
		const m = parseInt(minutes) || 0;
		const clamped = clamp(m, 0, 59);
		setMinutes(clamped.toString());
		onChange((parseInt(hours) || 0) * 60 + clamped);
	};

	return (
		<View style={styles.container}>
			<View style={styles.picker}>
				<TextInput
					style={styles.input}
					keyboardType="numeric"
					value={hours}
					onChangeText={handleHoursChange}
					onBlur={handleHoursBlur}
					maxLength={2}
					editable={!disabled}
				/>
				<Text style={styles.label}>h</Text>
			</View>
			<View style={[styles.picker, styles.pickerLast]}>
				<TextInput
					style={styles.input}
					keyboardType="numeric"
					value={minutes}
					onChangeText={handleMinutesChange}
					onBlur={handleMinutesBlur}
					maxLength={2}
					editable={!disabled}
				/>
				<Text style={styles.label}>m</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	picker: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 4,
		marginRight: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 1.5,
		elevation: 1,
	},
	pickerLast: {
		marginRight: 0,
	},
	input: {
		width: 30,
		textAlign: "center",
		fontSize: 14,
		fontWeight: "500",
		padding: 0,
		marginRight: 2,
	},
	label: {
		fontSize: 14,
		fontWeight: "500",
		color: "#555",
	},
});
