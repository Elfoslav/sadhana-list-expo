import {
	Modal,
	TextInput,
	Pressable,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
	View,
	Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "./ui/Button";
import SadhanaData from "../models/SadhanaData";
import { useUserStore } from "../stores/useUserStore";
import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles";
import modalStyles from "../styles/modalStyles";
import { formatDate, getAbbreviatedDayName } from "../lib/functions";
import TimePicker from "./TimePicker";
import DurationPicker from "./DurationPicker";

interface SadhanaModalProps {
	isVisible: boolean;
	readOnly?: boolean;
	sadhanaData: SadhanaData;
	confirmModal: (sadhanaData: SadhanaData) => void;
	closeModal: () => void;
}

const BUTTON_WIDTH = "48%";

const SadhanaModal: React.FC<SadhanaModalProps> = ({
	isVisible,
	sadhanaData,
	readOnly,
	confirmModal,
	closeModal,
}) => {
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const [localSadhanaData, setLocalSadhanaData] =
		useState<SadhanaData>(sadhanaData);

	console.log(sadhanaData);

	const handleChange = (value: string | number | null, attrName: string) => {
		console.log(localSadhanaData);
		const newSadhanaData = {
			...localSadhanaData,
			[attrName]: value,
		};

		if (user && attrName === "bedTime" && Number(value) > 0) {
			user.lastBedTime = Number(value);
			setUser(user);
		}

		if (user && attrName === "wakeUpTime" && Number(value) > 0) {
			user.lastWakeUpTime = Number(value);
			setUser(user);
		}

		console.log("newSadhanaData", newSadhanaData);

		setLocalSadhanaData(newSadhanaData);
	};

	useEffect(() => {
		// If modal is visible, set new sadhana data
		if (isVisible) {
			setLocalSadhanaData({
				...sadhanaData,
				bedTime: sadhanaData.bedTime ?? user?.lastBedTime ?? null,
				wakeUpTime:
					sadhanaData.wakeUpTime && sadhanaData.wakeUpTime > 0
						? sadhanaData.wakeUpTime
						: user?.lastWakeUpTime ?? null,
			});
		}
	}, [isVisible]);

	return (
		<Modal visible={isVisible} animationType="slide">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<View style={modalStyles.centeredView}>
					<View style={modalStyles.headerBar}>
						<View>
							{sadhanaData?.date && (
								<Text style={modalStyles.header}>
									<Text style={modalStyles.dayText}>
										{getAbbreviatedDayName(sadhanaData.date)}{" "}
									</Text>
									<Text style={modalStyles.dateText}>
										{formatDate(sadhanaData.date)}
									</Text>
								</Text>
							)}
						</View>

						<Pressable
							onPress={closeModal}
							hitSlop={10}
							style={({ pressed }) => [
								modalStyles.closeIcon, // your static styles
								{ opacity: pressed ? 0.6 : 1 }, // pressed effect
							]}
						>
							<Ionicons name="close" size={26} color="#333" />
						</Pressable>
					</View>
					<TouchableWithoutFeedback>
						<View style={modalStyles.modalView}>
							<View style={modalStyles.formField}>
								<Text style={modalStyles.inputLabel}>Bed time</Text>
								<TimePicker
									value={localSadhanaData?.bedTime}
									onChange={(val) => handleChange(val, "bedTime")}
									textStyle={{ fontSize: 15 }}
									disabled={readOnly}
									is24Hour
								/>
							</View>
							<View style={modalStyles.formField}>
								<Text style={modalStyles.inputLabel}>Wake up time</Text>
								<TimePicker
									value={localSadhanaData?.wakeUpTime}
									onChange={(val) => handleChange(val, "wakeUpTime")}
									textStyle={{ fontSize: 15 }}
									disabled={readOnly}
									is24Hour
								/>
							</View>

							<View style={modalStyles.formField}>
								<Text style={modalStyles.inputLabel}>Reading time</Text>
								<DurationPicker
									value={localSadhanaData?.reading || null}
									onChange={(minutes) => handleChange(minutes, "reading")}
									disabled={readOnly}
								/>
							</View>

							<View style={modalStyles.formField}>
								<Text style={modalStyles.inputLabel}>Service time</Text>
								<DurationPicker
									value={localSadhanaData?.service || null}
									onChange={(minutes) => handleChange(minutes, "service")}
									disabled={readOnly}
								/>
							</View>

							<View style={[modalStyles.formField, modalStyles.textareaField]}>
								<TextInput
									multiline
									numberOfLines={3}
									textAlignVertical="top"
									style={commonStyles.textArea}
									value={localSadhanaData?.note || ""}
									placeholder="Note..."
									onChangeText={(value) => handleChange(value, "note")}
									editable={!readOnly}
								/>
							</View>

							<View style={modalStyles.buttonsWrapper}>
								{!readOnly && (
									<Button
										style={[{ width: BUTTON_WIDTH }]}
										size="lg"
										onPress={() => confirmModal(localSadhanaData)}
										title="Confirm"
									/>
								)}

								<Button
									style={[
										modalStyles.cancelButton,
										{ width: readOnly ? "100%" : BUTTON_WIDTH },
									]}
									size="lg"
									onPress={closeModal}
									title={readOnly ? "Close" : "Cancel"}
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export default SadhanaModal;
