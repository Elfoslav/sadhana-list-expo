import {
	Modal,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	Text,
} from "react-native";
import Button from "./ui/Button";
import SadhanaData from "../models/SadhanaData";
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
	const [localSadhanaData, setLocalSadhanaData] =
		useState<SadhanaData>(sadhanaData);

	const handleChange = (value: string | number, attrName: string) => {
		console.log(localSadhanaData);
		setLocalSadhanaData({
			...localSadhanaData,
			[attrName]: value,
		});
	};

	useEffect(() => {
		// If modal is visible, set new sadhana data
		if (isVisible) {
			setLocalSadhanaData(sadhanaData);
		}
	}, [isVisible, sadhanaData]);

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
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
		</Modal>
	);
};

export default SadhanaModal;
