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
import { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles";
import modalStyles from "../styles/modalStyles";
import { formatDate, getAbbreviatedDayName } from "../lib/functions";

interface SadhanaModalProps {
	isVisible: boolean;
	sadhanaData: SadhanaData;
	confirmModal: (sadhanaData: SadhanaData) => void;
	closeModal: () => void;
}

const SadhanaModal: React.FC<SadhanaModalProps> = ({
	isVisible,
	sadhanaData,
	confirmModal,
	closeModal,
}) => {
	const [localSadhanaData, setLocalSadhanaData] =
		useState<SadhanaData>(sadhanaData);

	const handleChange = (value: string, attrName: string) => {
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
					<TouchableWithoutFeedback>
						<View style={modalStyles.modalView}>
							{/* <Pressable style={styles.closeButton} onPress={closeModal}>
                <Icon name="close" />
              </Pressable>

							{/* <View style={styles.formField}>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={localSadhanaData?.japaRounds ? localSadhanaData.japaRounds.toString() : ''}
                  placeholder="0"
                  onChangeText={(value) => handleChange(value, 'japaRounds')}
                />
                <Text>Japa rounds</Text>
              </View> */}

							{sadhanaData?.date && (
								<Text style={modalStyles.header}>
									{getAbbreviatedDayName(sadhanaData.date)}{" "}
									{formatDate(sadhanaData.date)}
								</Text>
							)}

							<View style={modalStyles.formField}>
								<TextInput
									multiline
									numberOfLines={3}
									textAlignVertical="top"
									style={commonStyles.textArea}
									value={localSadhanaData?.note || ""}
									placeholder="Note..."
									onChangeText={(value) => handleChange(value, "note")}
								/>
							</View>

							<View style={modalStyles.buttonsWrapper}>
								<Button
									style={modalStyles.button}
									onPress={() => confirmModal(localSadhanaData)}
									title="Confirm"
								/>

								<Button
									style={[modalStyles.button, modalStyles.cancelButton]}
									onPress={closeModal}
									title="Cancel"
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
