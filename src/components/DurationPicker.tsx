import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

type DurationPickerProps = {
	value: number | null; // total minutes
	disabled?: boolean;
	onChange: (minutes: number | null) => void;
};

export default function DurationPicker({
	value = null,
	disabled,
	onChange,
}: DurationPickerProps) {
	const [hours, setHours] = useState("");
	const [minutes, setMinutes] = useState("");

	// Sync local state when value prop changes
	useEffect(() => {
		if (value === null) {
			setHours("");
			setMinutes("");
		} else {
			setHours(Math.floor(value / 60).toString());
			setMinutes((value % 60).toString());
		}
	}, [value]);

	const computeTotal = (h: string, m: string): number | null => {
		if (h === "" && m === "") return null;

		const hoursNum = parseInt(h) || 0;
		const minutesNum = parseInt(m) || 0;

		return hoursNum * 60 + minutesNum;
	};

	const clamp = (val: number, min: number, max: number) =>
		Math.min(Math.max(val, min), max);

	const handleHoursChange = (text: string) => {
		if (text === "") {
			setHours("");
			onChange(computeTotal("", minutes));
			return;
		}

		const h = parseInt(text);
		if (!isNaN(h)) {
			const clamped = clamp(h, 0, 23).toString();
			setHours(clamped);
			onChange(computeTotal(clamped, minutes));
		}
	};

	const handleHoursBlur = () => {
		if (hours === "") return;
		const clamped = clamp(parseInt(hours), 0, 23).toString();
		setHours(clamped);
		onChange(computeTotal(clamped, minutes));
	};

	const handleMinutesChange = (text: string) => {
		if (text === "") {
			setMinutes("");
			onChange(computeTotal(hours, ""));
			return;
		}

		const m = parseInt(text);
		if (!isNaN(m)) {
			const clamped = clamp(m, 0, 59).toString();
			setMinutes(clamped);
			onChange(computeTotal(hours, clamped));
		}
	};

	const handleMinutesBlur = () => {
		if (minutes === "") return;
		const clamped = clamp(parseInt(minutes), 0, 59).toString();
		setMinutes(clamped);
		onChange(computeTotal(hours, clamped));
	};

	return (
		<View style={styles.container}>
			<View style={styles.picker}>
				<TextInput
					style={styles.input}
					keyboardType="numeric"
					value={hours}
					placeholder="0"
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
					placeholder="0"
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
		paddingVertical: 2,
	},
	label: {
		fontSize: 14,
		fontWeight: "500",
		color: "#555",
	},
});
