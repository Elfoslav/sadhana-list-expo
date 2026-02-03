import React from "react";
import {
	Modal,
	View,
	ScrollView,
	Pressable,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import modalStyles from "./BaseModal.styles";

interface BaseModalProps {
	isVisible: boolean;
	title?: React.ReactNode;
	onClose: () => void;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
	isVisible,
	title,
	onClose,
	children,
	footer,
}) => {
	return (
		<Modal visible={isVisible} animationType="slide" transparent>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
			>
				<SafeAreaView style={modalStyles.centeredView} edges={["top"]}>
					{/* Header */}
					<View style={modalStyles.headerBar}>
						<View>{title}</View>
						<Pressable
							onPress={onClose}
							hitSlop={10}
							style={({ pressed }) => [
								modalStyles.closeIcon,
								{ opacity: pressed ? 0.6 : 1 },
							]}
						>
							<Ionicons name="close" size={26} color="#333" />
						</Pressable>
					</View>

					<View style={modalStyles.modalView}>
						{/* Content */}
						<View>{children}</View>

						{/* Footer */}
						{footer && <View style={modalStyles.footer}>{footer}</View>}
					</View>
				</SafeAreaView>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export default BaseModal;
