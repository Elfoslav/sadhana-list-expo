import AsyncStorage from "@react-native-async-storage/async-storage";
import Settings from "../models/Settings";

const SETTINGS = "settings";

class SettingsAsyncStore {
	async createSettings(settings: Settings) {
		try {
			const existingSettings = await AsyncStorage.getItem(SETTINGS);
			if (!existingSettings) {
				await AsyncStorage.setItem(SETTINGS, JSON.stringify(settings));
				return settings;
			}

			return null;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	// Method to read user data
	async getSettings(): Promise<Settings | null> {
		try {
			const settings = await AsyncStorage.getItem(SETTINGS);
			if (settings !== null) {
				return JSON.parse(settings);
			}

			console.log("settings not found");
			return null;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	async saveSettings(settings: Settings) {
		try {
			await AsyncStorage.setItem(SETTINGS, JSON.stringify(settings));
		} catch (error) {
			console.log("saveSettings error", error);
			throw error;
		}
	}
}

export default SettingsAsyncStore;
