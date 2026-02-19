import AsyncStorage from "@react-native-async-storage/async-storage";
import User from "../models/User";
import { dateReviver } from "../lib/functions";

// Store single user
const USERNAME = "username";

class UserAsyncStore {
	async createUser(newUser: User) {
		try {
			const existingUser = await AsyncStorage.getItem(newUser.username);
			if (!existingUser) {
				await AsyncStorage.setItem(newUser.username, JSON.stringify(newUser));
				return newUser;
			}

			return null;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	// Method to read user data
	async getUser(username?: string): Promise<User | null> {
		try {
			if (!username) return null;

			const user = await AsyncStorage.getItem(username);
			if (user !== null) {
				return JSON.parse(user, dateReviver);
			}

			console.log(`user ${username} not found`);
			return null;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	// Method to write user data
	async saveUser(user: User) {
		try {
			console.log("UserAsyncStore.saveUser user: ", user.updatedAt);
			await AsyncStorage.setItem(user.username, JSON.stringify(user));
		} catch (error) {
			console.log("saveUser error", error);
			throw error;
		}
	}

	async saveUsername(username: string) {
		try {
			await AsyncStorage.setItem(USERNAME, username);
		} catch (error) {
			console.log("saveUsername error", error);
			throw error;
		}
	}

	async getUsername(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(USERNAME);
		} catch (e) {
			console.log(e);
			throw e;
		}
	}
}

export default UserAsyncStore;
