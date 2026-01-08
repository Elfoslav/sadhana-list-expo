import { TextInput, Pressable, View, Text } from "react-native";
import BaseModal from "./BaseModal";
import Button from "../ui/Button";
import SadhanaData from "../../models/SadhanaData";
import { useUserStore } from "../../stores/useUserStore";
import React, { useEffect, useState } from "react";
import commonStyles from "../../styles/commonStyles";
import modalStyles from "./SadhanaModal.styles";
import baseModalStyles from "./BaseModal.styles";
import {
	formatDate,
	getAbbreviatedDayName,
	getHHmm,
} from "../../lib/functions";
import TimePicker from "../TimePicker";
import DurationPicker from "../DurationPicker";

interface Props {
	isVisible: boolean;
	readOnly?: boolean;
	sadhanaData: SadhanaData;
	onConfirm: (data: SadhanaData) => void;
	onClose: () => void;
}

const BUTTON_WIDTH = "47%";

const SadhanaModal: React.FC<Props> = ({
	isVisible,
	readOnly,
	sadhanaData,
	onConfirm,
	onClose,
}) => {
	const user = useUserStore((s) => s.user);
	const [localData, setLocalData] = useState<SadhanaData>(sadhanaData);

	console.log("SadhanaModal sadhanaData: ", sadhanaData);

	const handleChange = (value: string | number | null, attrName: string) => {
		console.log("SadhanaModal handleChange localSadhanaData", localData);
		const newSadhanaData = {
			...localData,
			[attrName]: value,
		};

		setLocalData(newSadhanaData);
	};

	const setLastBedTime = () => {
		const newSadhanaData = {
			...localData,
			bedTime: user?.lastBedTime ?? null,
		};

		setLocalData(newSadhanaData);
	};

	const setLastWakeUpTime = () => {
		const newSadhanaData = {
			...localData,
			wakeUpTime: user?.lastWakeUpTime ?? null,
		};

		setLocalData(newSadhanaData);
	};

	useEffect(() => {
		if (isVisible) {
			setLocalData({ ...sadhanaData });
		}
	}, [isVisible, sadhanaData]);

	const header = sadhanaData?.date ? (
		<Text style={baseModalStyles.header}>
			<Text style={modalStyles.dayText}>
				{getAbbreviatedDayName(sadhanaData.date)}{" "}
			</Text>
			<Text style={modalStyles.dateText}>{formatDate(sadhanaData.date)}</Text>
		</Text>
	) : null;

	const footer = (
		<View style={baseModalStyles.buttonsWrapper}>
			{!readOnly && (
				<Button
					style={{ width: BUTTON_WIDTH }}
					size="lg"
					title="Confirm"
					onPress={() => onConfirm(localData)}
				/>
			)}
			<Button
				style={[{ width: readOnly ? "100%" : BUTTON_WIDTH }]}
				variant="secondary"
				size="lg"
				title={readOnly ? "Close" : "Cancel"}
				onPress={onClose}
			/>
		</View>
	);

	return (
		<BaseModal
			isVisible={isVisible}
			title={header}
			onClose={onClose}
			footer={footer}
		>
			<View style={modalStyles.formField}>
				<View style={modalStyles.formField}>
					<Text style={modalStyles.inputLabel}>Bed time</Text>
					<Pressable onPress={setLastBedTime}>
						<Text style={modalStyles.subLabel}>
							{user?.lastBedTime != null && `(${getHHmm(user?.lastBedTime)})`}
						</Text>
					</Pressable>
				</View>
				<View style={modalStyles.formField}>
					<TimePicker
						value={localData?.bedTime}
						onChange={(val) => handleChange(val, "bedTime")}
						showTime={false}
						disabled={readOnly}
						is24Hour
					/>
					<DurationPicker
						value={localData?.bedTime}
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
							{user?.lastWakeUpTime && `(${getHHmm(user?.lastWakeUpTime)})`}
						</Text>
					</Pressable>
				</View>
				<View style={modalStyles.formField}>
					<TimePicker
						value={localData?.wakeUpTime}
						onChange={(val) => handleChange(val, "wakeUpTime")}
						showTime={false}
						disabled={readOnly}
						is24Hour
					/>
					<DurationPicker
						value={localData?.wakeUpTime}
						onChange={(minutes) => handleChange(minutes, "wakeUpTime")}
						disabled={readOnly}
					/>
				</View>
			</View>

			<View style={modalStyles.formField}>
				<Text style={modalStyles.inputLabel}>Reading time</Text>
				<DurationPicker
					value={localData?.reading || null}
					onChange={(minutes) => handleChange(minutes, "reading")}
					disabled={readOnly}
				/>
			</View>

			<View style={modalStyles.formField}>
				<Text style={modalStyles.inputLabel}>Service time</Text>
				<DurationPicker
					value={localData?.service || null}
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
					value={localData?.note || ""}
					placeholder="Note..."
					onChangeText={(value) => handleChange(value, "note")}
					editable={!readOnly}
				/>
			</View>
		</BaseModal>
	);
};

export default SadhanaModal;
