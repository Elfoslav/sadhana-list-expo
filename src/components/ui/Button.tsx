import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type ButtonProps = {
	onPress: () => void;
	title?: string;
	children?: React.ReactNode;
	variant?: "primary" | "secondary" | "danger" | "clear"; // extended types
	size?: "sm" | "md" | "lg";
	style?: ViewStyle | ViewStyle[];
	disabled?: boolean;
	fullWidth?: boolean;
};

const Button = ({
	onPress,
	title,
	children,
	variant = "primary", // default to primary
	size = "md",
	style,
	disabled = false,
	fullWidth = false,
}: ButtonProps) => {
	const baseStyle = [
		styles.base,
		variantStyles[variant],
		sizeStyles[size],
		fullWidth && styles.fullWidth,
		disabled && styles.disabled,
		style,
	];
	const textStyle = [
		styles.text,
		textVariantStyles[variant],
		sizeTextStyles[size],
		disabled && styles.disabledText,
	];
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.55}
			style={baseStyle}
			disabled={disabled}
		>
			{children ?? <Text style={textStyle}>{title}</Text>}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	base: {
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontWeight: "600",
	},
	disabled: {
		opacity: 0.5,
	},
	disabledText: {},
	fullWidth: {
		width: "100%",
	},
});

const variantStyles = {
	primary: {
		backgroundColor: "#007bff",
	},
	secondary: {
		backgroundColor: "#6c757d",
	},
	danger: {
		backgroundColor: "#dc3545",
	},
	clear: {
		backgroundColor: "transparent",
	},
};

const textVariantStyles = {
	primary: {
		color: "#fff",
	},
	secondary: {
		color: "#fff",
	},
	danger: {
		color: "#fff",
	},
	clear: {
		color: "#007bff",
	},
};

const sizeStyles = StyleSheet.create({
	sm: { paddingVertical: 6, paddingHorizontal: 12 },
	md: { paddingVertical: 10, paddingHorizontal: 16 },
	lg: { paddingVertical: 14, paddingHorizontal: 20 },
});

const sizeTextStyles = StyleSheet.create({
	sm: {},
	md: {},
	lg: { fontSize: 16 },
});

export default Button;
