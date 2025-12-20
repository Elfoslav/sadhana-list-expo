import {
	Modal,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
	View,
	Text,
} from "react-native";
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

const BUTTON_WIDTH = 117;

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

	const handleChange = (value: string | number, attrName: string) => {
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
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<TouchableOpacity
					style={modalStyles.modalBackground}
					activeOpacity={1}
					onPressOut={closeModal}
				>
					<View style={modalStyles.centeredView}>
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
										value={localSadhanaData?.reading || 0}
										onChange={(minutes) => handleChange(minutes, "reading")}
										disabled={readOnly}
									/>
								</View>

								<View style={modalStyles.formField}>
									<Text style={modalStyles.inputLabel}>Service time</Text>
									<DurationPicker
										value={localSadhanaData?.service || 0}
										onChange={(minutes) => handleChange(minutes, "service")}
										disabled={readOnly}
									/>
								</View>

								<View
									style={[modalStyles.formField, modalStyles.textareaField]}
								>
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
											style={[modalStyles.button, { width: BUTTON_WIDTH }]}
											onPress={() => confirmModal(localSadhanaData)}
											title="Confirm"
										/>
									)}

									<Button
										style={[
											modalStyles.button,
											modalStyles.cancelButton,
											{ width: readOnly ? "100%" : BUTTON_WIDTH },
										]}
										onPress={closeModal}
										title={readOnly ? "Close" : "Cancel"}
									/>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export default SadhanaModal;
