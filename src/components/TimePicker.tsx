import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleProp,
	ViewStyle,
	TextStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateFromMinutes } from "../lib/functions";

type Props = {
	value: number | null; // minutes since midnight
	onChange: (minutes: number) => void;
	showTime?: boolean;
	shown?: boolean;
	disabled?: boolean;
	is24Hour?: boolean;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	iconColor?: string;
	iconSize?: number;
};

export default function TimePicker({
	value,
	onChange,
	showTime = true,
	shown = false,
	disabled = false,
	is24Hour = false,
	style,
	textStyle,
	iconColor = "#BBB",
	iconSize = 24,
}: Props) {
	const [show, setShow] = useState(shown);

	// Convert Date to minutes
	const getMinutesFromDate = (date: Date) => {
		return date.getHours() * 60 + date.getMinutes();
	};

	const handleChange = (_: any, selectedDate?: Date) => {
		setShow(false);
		if (selectedDate) {
			const minutes = getMinutesFromDate(selectedDate);
			onChange(minutes);
		}
	};

	const handleOpenTimePicker = () => !disabled && setShow(true);

	// Format for display as HH:mm
	const formattedTime = getDateFromMinutes(value)?.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: !is24Hour,
	});

	return (
		<View style={style}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				{showTime && (
					<TouchableOpacity disabled={disabled} onPress={handleOpenTimePicker}>
						<Text style={textStyle}>{formattedTime}</Text>
					</TouchableOpacity>
				)}
				<TouchableOpacity onPress={handleOpenTimePicker} activeOpacity={0.5}>
					<MaterialIcons
						name="access-time"
						size={iconSize}
						color={iconColor}
						style={{ marginLeft: showTime ? 8 : 0 }}
					/>
				</TouchableOpacity>
			</View>

			{show && (
				<DateTimePicker
					value={getDateFromMinutes(value)}
					mode="time"
					display="spinner"
					is24Hour={is24Hour}
					onChange={handleChange}
				/>
			)}
		</View>
	);
}
