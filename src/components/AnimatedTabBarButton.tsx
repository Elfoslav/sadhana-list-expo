import {
	TouchableOpacity,
	Animated,
	StyleProp,
	ViewStyle,
	GestureResponderEvent,
} from "react-native";
import { useRef, useEffect } from "react";
import { useRoute, useNavigationState } from "@react-navigation/native";

type AnimatedTabBarButtonProps = {
	children: React.ReactNode;
	onPress?: (event: GestureResponderEvent) => void;
	label: string;
	style?: StyleProp<ViewStyle>;
};

export default function AnimatedTabBarButton({
	children,
	onPress,
	label,
	style,
}: AnimatedTabBarButtonProps) {
	const route = useRoute();
	const isFocused = useNavigationState((state) => {
		const currentRoute = state.routes[state.index];
		return currentRoute.key === route.key;
	});

	const anim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

	useEffect(() => {
		Animated.timing(anim, {
			toValue: isFocused ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [isFocused]);

	const backgroundColor = anim.interpolate({
		inputRange: [0, 1],
		outputRange: ["transparent", "#e6f0ff"],
	});

	const textColor = anim.interpolate({
		inputRange: [0, 1],
		outputRange: ["#888", "#007bff"],
	});

	const scale = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 1.08],
	});

	return (
		<TouchableOpacity onPress={onPress} style={[{ flex: 1, top: -2 }, style]}>
			<Animated.View
				style={{
					flex: 1,
					width: "100%",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor,
					transform: [{ scale }],
				}}
			>
				{children}
				<Animated.Text
					style={{
						color: textColor,
						fontSize: 12,
						marginTop: 2,
						fontWeight: isFocused ? "700" : "400",
					}}
				>
					{label}
				</Animated.Text>
			</Animated.View>
		</TouchableOpacity>
	);
}
