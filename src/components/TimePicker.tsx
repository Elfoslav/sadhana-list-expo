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

type Props = {
	value: number | null; // minutes since midnight
	onChange: (minutes: number) => void;
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
	disabled = false,
	is24Hour = false,
	style,
	textStyle,
	iconColor = "#BBB",
	iconSize = 24,
}: Props) {
	const [show, setShow] = useState(false);

	// Convert minutes to Date
	const getDateFromMinutes = (minutes: number | null) => {
		const date = new Date();
		if (minutes == null) {
			date.setHours(0);
			date.setMinutes(0);
		} else {
			date.setHours(Math.floor(minutes / 60));
			date.setMinutes(minutes % 60);
		}
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	};

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
				<TouchableOpacity disabled={disabled} onPress={handleOpenTimePicker}>
					<Text style={textStyle}>{formattedTime}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleOpenTimePicker} activeOpacity={0.5}>
					<MaterialIcons
						name="access-time"
						size={iconSize}
						color={iconColor}
						style={{ marginLeft: 8 }}
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
