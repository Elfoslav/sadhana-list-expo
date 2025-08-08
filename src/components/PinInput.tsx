// components/PinInput.tsx

import React, { useEffect, useRef } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";

interface PinInputProps {
	value: string;
	onChange: (value: string) => void;
	autoFocus?: boolean;
	length?: number;
}

const PinInput: React.FC<PinInputProps> = ({
	value,
	onChange,
	autoFocus = false,
	length = 4,
}) => {
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		if (autoFocus) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [autoFocus]);

	const handleChange = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "");
		if (cleaned.length <= length) {
			onChange(cleaned);
		}
	};

	const handleBoxPress = () => {
		inputRef.current?.focus();
	};

	return (
		<TouchableWithoutFeedback onPress={handleBoxPress}>
			<View style={styles.wrapper}>
				{Array.from({ length }).map((_, i) => (
					<View key={i} style={styles.box}>
						<TextInput
							style={styles.boxText}
							value={value[i] || ""}
							editable={false}
						/>
					</View>
				))}

				<TextInput
					ref={inputRef}
					style={styles.hiddenInput}
					value={value}
					onChangeText={handleChange}
					keyboardType="number-pad"
					maxLength={length}
					autoFocus={false}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	box: {
		width: 48,
		height: 55,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: "#aaa",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	boxText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#000",
	},
	hiddenInput: {
		position: "absolute",
		opacity: 0.01,
		height: 0,
	},
});

export default PinInput;
