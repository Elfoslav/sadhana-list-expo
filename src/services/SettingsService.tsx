import Settings from "../models/Settings";
import SettingsAsyncStore from "../stores/SettingsAsyncStore";

class SettingsService {
	// Main local store
	private settingsStore;
	// Backup online store
	// private settingsFirestore;

	constructor() {
		this.settingsStore = new SettingsAsyncStore();
		// this.settingsFirestore = new SettingsFirestore();
	}

	async createSettings(newSettings: Settings) {
		try {
			const createdSettings = await this.settingsStore.createSettings(
				newSettings
			);
			// Do not wait for firestore
			// this.settingsFirestore.createSettings(newSettings);
			return createdSettings;
		} catch (error) {
			throw error;
		}
	}

	// Method to read settings data
	async getSettings() {
		try {
			return await this.settingsStore.getSettings();
		} catch (error) {
			throw error;
		}
	}

	// Method to write settings data
	async saveSettings(settings: Settings) {
		try {
			// Backup data in firestore DB
			// this.settingsFirestore.saveSettings(settings);
			return await this.settingsStore.saveSettings(settings);
		} catch (error) {
			console.log("saveSettings error", error);
			throw error;
		}
	}
}

export default SettingsService;
