import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
	View,
	StyleSheet,
	StatusBar,
	ScrollView,
	useColorScheme,
	Image,
	TextInput,
	TouchableOpacity,
	Text,
	Alert,
} from "react-native";
import commonStyles from "../styles/commonStyles";
import UsersService from "../services/UsersService";
import User from "../models/User";

function HomeView() {
	const router = useRouter();
	const usersService = new UsersService();
	const [user, setUser] = useState<User | null>(null);
	const [username, setUsername] = useState(user ? user.username : "");
	const [isLoading, setIsLoading] = useState(false);
	const isDarkMode = useColorScheme() === "dark";
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	const onChangeUsername = (username: string) => {
		setUsername(username.trim());
	};

	const goToSadhanaList = async () => {
		if (!username) {
			Alert.alert(
				"Fill in username!",
				"Please enter your username before proceeding."
			);
			return;
		}

		setIsLoading(true);
		await usersService.saveUsername(username);
		// create user
		await usersService.createUser({
			username,
			sadhanaData: [],
		});

		setIsLoading(false);

		router.push({
			pathname: "/sadhana-list",
			params: { username },
		});
	};

	const getSadhanaButtonText = () => {
		return isLoading && !user ? "Configuring..." : "Show Sadhana List";
	};

	useEffect(() => {
		const getUser = async () => {
			setUsername((await usersService.getUsername()) || "");
			const foundUser = await usersService.getUser(username);
			if (foundUser) {
				setUser(foundUser);
				setUsername(foundUser.username);
				router.push({
					pathname: "/sadhana-list",
					params: { username: foundUser.username },
				});
			}
		};

		getUser();
	}, []);

	return (
		<View style={backgroundStyle}>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={backgroundStyle}
			>
				<View style={commonStyles.container}>
					<Image
						style={styles.logo}
						source={require("../../assets/iskcon-logo.png")}
					/>
					<TextInput
						style={commonStyles.textInput}
						value={username}
						placeholder="Your name"
						autoCorrect={false}
						onChangeText={onChangeUsername}
					/>

					<TouchableOpacity
						activeOpacity={0.85}
						style={commonStyles.touchableBtnLg}
						onPress={goToSadhanaList}
					>
						<Text style={commonStyles.touchableBtnText}>
							{getSadhanaButtonText()}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	centerText: {
		textAlign: "center",
		fontSize: 18,
	},
	logo: {
		width: "100%", // Set the width to 100%
		height: 220, // Set the height (adjust as needed)
	},
});

export default HomeView;
