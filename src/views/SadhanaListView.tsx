import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	TextInput,
	FlatList,
} from "react-native";
import UsersService from "../services/UsersService";
import SadhanaData from "../models/SadhanaData";
import User from "../models/User";
import SadhanaManager from "../lib/SadhanaManager";
import { useUserStore } from "../stores/useUserStore";
import { formatDate, getAbbreviatedDayName, getHHmm } from "../lib/functions";
import Button from "../components/ui/Button";
import CheckBox from "../components/ui/CheckBox";
import { MaterialIcons } from "@expo/vector-icons";
import SadhanaModal from "../components/SadhanaModal";
import commonStyles from "../styles/commonStyles";

const SadhanaListView: React.FC = () => {
	const { username, readOnly } = useLocalSearchParams() as {
		username: string;
		readOnly: string;
	};

	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: `Sadhana List ${username}`,
		});
	}, [navigation]);

	if (!username) {
		return <Text>No username provided</Text>;
	}

	const listRef = useRef<FlatList>(null);
	const usersService = new UsersService();
	const sadhanaManager = new SadhanaManager();
	const initialDate = new Date();
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const [isLoading, setIsLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(initialDate);
	// current shown sadhana list
	const [sadhanaList, setSadhanaList] = useState<SadhanaData[]>([]);
	const [isEditModalVisible, setEditModalVisible] = useState(false);
	const [editingIndex, setEditingIndex] = useState(-1);

	let { mangalaSum, guruPujaSum, gauraAratiSum, japaSum } = useMemo(() => {
		return {
			mangalaSum: sadhanaList.reduce(
				(sum, item) => sum + (item.mangala ? 1 : 0),
				0
			),
			guruPujaSum: sadhanaList.reduce(
				(sum, item) => sum + (item.guruPuja ? 1 : 0),
				0
			),
			gauraAratiSum: sadhanaList.reduce(
				(sum, item) => sum + (item.gauraArati ? 1 : 0),
				0
			),
			japaSum: sadhanaList.reduce(
				(sum, item) => sum + (item.japaRounds ?? 0),
				0
			),
		};
	}, [sadhanaList]);

	const getSleepDuration = (
		wakeUpTime: number | null,
		bedTime: number | null
	) => {
		if (!wakeUpTime || !bedTime) return null;

		// duration in hours
		const diffMs = wakeUpTime - bedTime;
		const diffH = diffMs / 1000 / 60 / 60;
		return diffH > 0 ? diffH.toFixed(2) : null;
	};

	async function generateSadhanaList(
		date: Date,
		username: string
	): Promise<SadhanaData[]> {
		console.log("generate sadhanaList", username);
		const currentYear = date.getFullYear();
		const currentMonth = date.getMonth();
		const numberOfDaysInMonth = new Date(
			currentYear,
			currentMonth + 1,
			0
		).getDate();

		let foundUser;
		if (readOnly) {
			foundUser = (await usersService.getRemoteUser(username)) as User;
		} else {
			foundUser = user || ((await usersService.getUser(username)) as User);
		}

		return Array.from({ length: numberOfDaysInMonth }, (_, i) => i + 1).map(
			(day) => {
				// Create a Date object for the current day in the loop
				const currentDate = new Date(currentYear, currentMonth, day);

				// Find the matching sadhanaItem in user.sadhanaData based on day, month, and year
				const sadhanaItem = sadhanaManager.findSadhanaItemByDate(
					foundUser.sadhanaData,
					currentDate
				);

				return {
					date: currentDate,
					mangala: sadhanaItem ? sadhanaItem.mangala : false,
					guruPuja: sadhanaItem ? sadhanaItem.guruPuja : false,
					gauraArati: sadhanaItem ? sadhanaItem.gauraArati : false,
					japaRounds: sadhanaItem ? sadhanaItem.japaRounds : 0,
					bedTime: sadhanaItem ? sadhanaItem.bedTime : null,
					wakeUpTime: sadhanaItem ? sadhanaItem.wakeUpTime : null,
					reading: sadhanaItem ? sadhanaItem.reading : 0,
					service: sadhanaItem ? sadhanaItem.service : 0,
					note: sadhanaItem ? sadhanaItem.note : "",
				};
			}
		);
	}

	// Function to handle switching to the previous month
	const switchToPreviousMonth = () => {
		const previousMonth = new Date(currentDate);
		previousMonth.setMonth(currentDate.getMonth() - 1);
		setCurrentDate(previousMonth);
	};

	// Function to handle switching to the next month
	const switchToNextMonth = () => {
		const nextMonth = new Date(currentDate);
		nextMonth.setMonth(currentDate.getMonth() + 1);
		setCurrentDate(nextMonth);
	};

	const updateSadhanaList = async (sadhanaData: SadhanaData[]) => {
		setSadhanaList(sadhanaData);

		if (user) {
			const mergedSadhanaData = sadhanaManager.mergeSadhanaList(
				sadhanaData,
				user
			);
			const updatedUser = {
				...user,
				sadhanaData: mergedSadhanaData,
			};

			setUser(updatedUser);
			console.log(
				"user.lastBedTime, user.lastWakeUpTime",
				user.lastBedTime,
				user.lastWakeUpTime
			);
			usersService.saveUser(updatedUser);
		}
	};

	const handleCheckboxChange = (index: number, propertyName: string) => {
		const updatedSadhanaList = [...sadhanaList];
		updatedSadhanaList[index][propertyName] =
			!updatedSadhanaList[index][propertyName];
		updateSadhanaList(updatedSadhanaList);
	};

	const handleJapaRoundsChange = (index: number, value: string) => {
		const updatedSadhanaList = [...sadhanaList];
		if (value) {
			updatedSadhanaList[index].japaRounds = parseInt(value, 10);
			updateSadhanaList(updatedSadhanaList);
		} else {
			updatedSadhanaList[index].japaRounds = null;
			updateSadhanaList(updatedSadhanaList);
		}
	};

	const openEditModal = (index: number) => {
		setEditingIndex(index);
		setEditModalVisible(true);
	};

	const confirmEditModal = (sadhanaData: SadhanaData) => {
		if (sadhanaData.note) {
			// Trim note from possible trailing whitespace
			sadhanaData.note = sadhanaData.note.trim();
		}

		const updatedSadhanaList = [...sadhanaList];
		// Update sadhana data on given index
		updatedSadhanaList[editingIndex] = sadhanaData;
		updateSadhanaList(updatedSadhanaList);
		closeEditModal();
	};

	const closeEditModal = () => {
		setEditModalVisible(false);
	};

	const isSameDay = (date1: Date, date2: Date) => {
		return (
			date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth()
		);
	};

	const todayIndex = sadhanaList.findIndex((sadhana) =>
		isSameDay(sadhana.date, new Date())
	);

	// Scroll to today's item after mounting
	useEffect(() => {
		if (todayIndex >= 0) {
			setTimeout(() => {
				listRef.current?.scrollToIndex({ index: todayIndex, animated: true });
			}, 100); // delay ensures FlatList is rendered
		}
	}, [todayIndex]);

	const shortenString = (text: string, num: number) => {
		const shortenedText = text.slice(0, num);

		if (text.length > num) {
			return `${shortenedText}...`;
		}

		return shortenedText;
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const sadhanaData = await generateSadhanaList(currentDate, username);
			setSadhanaList(sadhanaData);
			setIsLoading(false);
		};

		fetchData();
	}, [currentDate]);

	const renderItem = ({
		item,
		index,
	}: {
		item: SadhanaData;
		index: number;
	}) => {
		const sadhana = item;
		const isToday = isSameDay(sadhana.date, new Date());

		return (
			<View style={[styles.row, isToday ? styles.activeRow : null]}>
				<View style={styles.flexRow}>
					<Text style={styles.dayText}>
						{getAbbreviatedDayName(sadhana.date)}
						{"\n"}
						{formatDate(sadhana.date)}
					</Text>
					<View style={styles.mangalaCheckboxContainer}>
						<CheckBox
							value={sadhana.mangala}
							editable={!readOnly}
							onChange={() => handleCheckboxChange(index, "mangala")}
						/>
					</View>
					<View style={styles.guruPujaCheckboxContainer}>
						<CheckBox
							value={sadhana.guruPuja}
							editable={!readOnly}
							onChange={() => handleCheckboxChange(index, "guruPuja")}
						/>
					</View>
					<View style={styles.gauraAratiCheckboxContainer}>
						<CheckBox
							value={sadhana.gauraArati}
							editable={!readOnly}
							onChange={() => handleCheckboxChange(index, "gauraArati")}
						/>
					</View>
					<TextInput
						style={commonStyles.numericInput}
						keyboardType="numeric"
						placeholder="0"
						maxLength={2}
						value={sadhana.japaRounds ? sadhana.japaRounds.toString() : ""}
						onChangeText={(value) => handleJapaRoundsChange(index, value)}
						editable={!readOnly}
					/>
					<Button
						variant="clear"
						onPress={() => openEditModal(index)}
						style={styles.editBtn}
					>
						<MaterialIcons name="edit" color="gray" size={22} />
					</Button>
				</View>

				<View style={{ flex: 1, flexDirection: "row", gap: 15 }}>
					{sadhana.bedTime != null && sadhana.bedTime > 0 && (
						<View style={commonStyles.flexRow}>
							<Text style={commonStyles.textBold}>Bed time: </Text>
							<Text>
								{/* hh:mm */}
								{String(Math.floor(sadhana.bedTime / 60)).padStart(2, "0")}:
								{String(sadhana.bedTime % 60).padStart(2, "0")}
							</Text>
						</View>
					)}

					{sadhana.wakeUpTime != null && sadhana.wakeUpTime > 0 && (
						<View style={commonStyles.flexRow}>
							<Text style={commonStyles.textBold}>Woke up: </Text>
							<Text>
								{/* hh:mm */}
								{String(Math.floor(sadhana.wakeUpTime / 60)).padStart(2, "0")}:
								{String(sadhana.wakeUpTime % 60).padStart(2, "0")}
							</Text>
						</View>
					)}

					{sadhana.reading != null && sadhana.reading > 0 && (
						<View style={commonStyles.flexRow}>
							<Text style={commonStyles.textBold}>Reading: </Text>
							<Text>{getHHmm(sadhana.reading)}</Text>
						</View>
					)}

					{sadhana.service != null && sadhana.service > 0 && (
						<View style={commonStyles.flexRow}>
							<Text style={commonStyles.textBold}>Service: </Text>
							<Text>{getHHmm(sadhana.service)}</Text>
						</View>
					)}
				</View>

				{sadhana.note && (
					<View style={styles.note}>
						<Text>{shortenString(sadhana.note, 50)}</Text>
					</View>
				)}
			</View>
		);
	};

	// Render the table as a vertical list
	return (
		<View style={{ flex: 1 }}>
			<View style={styles.table}>
				{/* Month navigation buttons */}
				<View style={styles.monthNav}>
					<Button variant="clear" onPress={switchToPreviousMonth}>
						<Text style={styles.navIcon}>&#8249;</Text>
					</Button>
					<Text style={styles.currentMonth}>
						{currentDate.toLocaleString("default", { month: "long" })}{" "}
						{currentDate.getFullYear()}
					</Text>
					<Button variant="clear" onPress={switchToNextMonth}>
						<Text style={styles.navIcon}>&#8250;</Text>
					</Button>
				</View>

				{/* Header row */}
				<View style={styles.headerRow}>
					<Text style={styles.headerText}>Date</Text>
					<Text style={styles.headerText}>Mangala</Text>
					<Text style={styles.headerText}>Guru Puja</Text>
					<Text style={styles.headerText}>Gaura</Text>
					<Text style={styles.headerText}>Japa</Text>
					<Text style={styles.headerText}>Note</Text>
				</View>

				{isLoading && sadhanaList.length === 0 && (
					<ActivityIndicator
						style={styles.activityIndicator}
						animating={isLoading}
						size="large"
						color="#008800"
					/>
				)}

				<FlatList
					ref={listRef}
					data={sadhanaList}
					renderItem={renderItem}
					keyExtractor={(item) => item.date.toString()}
					initialNumToRender={sadhanaList.length}
					removeClippedSubviews={false}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
					onScrollToIndexFailed={({ index, averageItemLength }) => {
						listRef.current?.scrollToOffset({
							offset: averageItemLength * index,
							animated: true,
						});
					}}
				/>

				<View style={[styles.row, styles.footer]}>
					<View style={styles.flexRow}>
						<Text style={styles.dayText}>Sum:</Text>
						<View style={styles.mangalaSumContainer}>
							<Text>
								{mangalaSum}/{sadhanaList.length}
							</Text>
						</View>
						<View style={styles.guruPujaSumContainer}>
							<Text>
								{guruPujaSum}/{sadhanaList.length}
							</Text>
						</View>
						<View style={styles.gauraAratiSumContainer}>
							<Text>
								{gauraAratiSum}/{sadhanaList.length}
							</Text>
						</View>
						<View style={styles.japaSumContainer}>
							<Text>
								{japaSum}/{sadhanaList.length * 16}
							</Text>
						</View>
					</View>
				</View>
			</View>

			<SadhanaModal
				isVisible={isEditModalVisible}
				readOnly={readOnly === "true"}
				sadhanaData={sadhanaList[editingIndex]}
				confirmModal={confirmEditModal}
				closeModal={closeEditModal}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	table: {
		flex: 1,
		flexDirection: "column",
	},
	activityIndicator: {
		marginTop: 10,
	},
	monthNav: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: -10,
	},
	currentMonth: {
		fontSize: 18,
	},
	navIcon: {
		fontSize: 36,
		marginBottom: 10,
		fontWeight: "bold",
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderColor: "lightgray",
		padding: 10,
		marginTop: -10,
		backgroundColor: "#FAFAFA",
	},
	row: {
		borderBottomWidth: 1,
		borderColor: "lightgray",
		paddingHorizontal: 10,
		paddingVertical: 7,
	},
	flexRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	activeRow: {
		backgroundColor: "#E0E0E0",
	},
	headerText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	dayText: {
		fontSize: 16,
		width: 50,
	},
	mangalaCheckboxContainer: {
		alignItems: "center",
		marginEnd: 30,
	},
	guruPujaCheckboxContainer: {
		alignItems: "center",
		marginEnd: 20,
	},
	gauraAratiCheckboxContainer: {
		alignItems: "center",
	},
	mangalaSumContainer: {
		marginStart: 5,
	},
	guruPujaSumContainer: {
		marginStart: 35,
	},
	gauraAratiSumContainer: {
		marginStart: 20,
	},
	japaSumContainer: {
		alignItems: "center",
		marginEnd: 46,
	},
	note: {
		marginTop: 2,
	},
	editBtn: {
		marginRight: -8,
	},
	footer: {
		borderWidth: 1,
		backgroundColor: "#EAEAEA",
		borderTopColor: "#CACACA",
		elevation: 14,
	},
});

export default SadhanaListView;
