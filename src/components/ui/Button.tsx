import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type ButtonProps = {
	onPress: () => void;
	title?: string;
	children?: React.ReactNode;
	variant?: "primary" | "secondary" | "danger" | "clear"; // extended types
	size?: "sm" | "md" | "lg";
	style?: ViewStyle | ViewStyle[];
};

const Button = ({
	onPress,
	title,
	children,
	variant = "primary", // default to primary
	size = "md",
	style,
}: ButtonProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.85}
			style={[styles.base, variantStyles[variant], sizeStyles[size], style]}
		>
			{children ?? (
				<Text style={[styles.text, textVariantStyles[variant]]}>{title}</Text>
			)}
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

const sizeStyles = {
	sm: { paddingVertical: 6, paddingHorizontal: 12 },
	md: { paddingVertical: 10, paddingHorizontal: 16 },
	lg: { paddingVertical: 14, paddingHorizontal: 20 },
};

export default Button;
