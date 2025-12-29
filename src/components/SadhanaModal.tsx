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
import { formatDate, getAbbreviatedDayName, getHHmm } from "../lib/functions";
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
	const [localSadhanaData, setLocalSadhanaData] =
		useState<SadhanaData>(sadhanaData);

	console.log(sadhanaData);

	const handleChange = (value: string | number | null, attrName: string) => {
		console.log(localSadhanaData);
		const newSadhanaData = {
			...localSadhanaData,
			[attrName]: value,
		};

		setLocalSadhanaData(newSadhanaData);
	};

	const setLastBedTime = () => {
		const newSadhanaData = {
			...localSadhanaData,
			bedTime: user?.lastBedTime ?? null,
		};

		setLocalSadhanaData(newSadhanaData);
	};

	const setLastWakeUpTime = () => {
		const newSadhanaData = {
			...localSadhanaData,
			wakeUpTime: user?.lastWakeUpTime ?? null,
		};

		setLocalSadhanaData(newSadhanaData);
	};

	useEffect(() => {
		// If modal is visible, set new sadhana data
		if (isVisible) {
			setLocalSadhanaData({
				...sadhanaData,
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
								<View style={modalStyles.formField}>
									<Text style={modalStyles.inputLabel}>Bed time</Text>
									<Pressable onPress={setLastBedTime}>
										<Text style={modalStyles.subLabel}>
											{user?.lastBedTime != null &&
												`(${getHHmm(user?.lastBedTime)})`}
										</Text>
									</Pressable>
								</View>
								<View style={modalStyles.formField}>
									<TimePicker
										value={localSadhanaData?.bedTime}
										onChange={(val) => handleChange(val, "bedTime")}
										showTime={false}
										disabled={readOnly}
										is24Hour
									/>
									<DurationPicker
										value={localSadhanaData?.bedTime}
										onChange={(minutes) => handleChange(minutes, "bedTime")}
										disabled={readOnly}
									/>
								</View>
							</View>
							<View style={modalStyles.formField}>
								<View style={modalStyles.formField}>
									<Text style={modalStyles.inputLabel}>Wake up time</Text>
									<Pressable onPress={setLastWakeUpTime}>
										<Text style={modalStyles.subLabel}>
											{user?.lastWakeUpTime &&
												`(${getHHmm(user?.lastWakeUpTime)})`}
										</Text>
									</Pressable>
								</View>
								<View style={modalStyles.formField}>
									<TimePicker
										value={localSadhanaData?.wakeUpTime}
										onChange={(val) => handleChange(val, "wakeUpTime")}
										showTime={false}
										disabled={readOnly}
										is24Hour
									/>
									<DurationPicker
										value={localSadhanaData?.wakeUpTime}
										onChange={(minutes) => handleChange(minutes, "wakeUpTime")}
										disabled={readOnly}
									/>
								</View>
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
									numberOfLines={6}
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
