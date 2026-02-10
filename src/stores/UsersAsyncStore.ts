import AsyncStorage from "@react-native-async-storage/async-storage";
import User from "../models/User";
import { dateReviver } from "../lib/functions";

class UsersAsyncStore {
	constructor(private key: string) {}

	async createUser(newUser: User): Promise<User | null> {
		try {
			const allUsers = await this.getAll();
			const exists = allUsers.find((u) => u.username === newUser.username);

			if (!exists) {
				const updatedUsers = [...allUsers, newUser];
				await AsyncStorage.setItem(this.key, JSON.stringify(updatedUsers));
				return newUser;
			}

			return null;
		} catch (e) {
			console.log("createUser error", e);
			throw e;
		}
	}

	async getAll(): Promise<User[]> {
		try {
			const data = await AsyncStorage.getItem(this.key);
			if (data) {
				return JSON.parse(data, dateReviver) as User[];
			}
			return [];
		} catch (e) {
			console.log("getAll error", e);
			throw e;
		}
	}

	async getUser(username: string): Promise<User | null> {
		try {
			const allUsers = await this.getAll();
			return allUsers.find((u) => u.username === username) || null;
		} catch (e) {
			console.log("getUser error", e);
			throw e;
		}
	}

	async saveUser(user: User): Promise<void> {
		try {
			const allUsers = await this.getAll();
			const index = allUsers.findIndex((u) => u.username === user.username);

			if (index >= 0) {
				allUsers[index] = user;
			} else {
				allUsers.push(user);
			}

			await AsyncStorage.setItem(this.key, JSON.stringify(allUsers));
		} catch (e) {
			console.log("saveUser error", e);
			throw e;
		}
	}

	async saveUsers(users: User[]): Promise<void> {
		try {
			await AsyncStorage.setItem(this.key, JSON.stringify(users));
		} catch (e) {
			console.log("saveUsers error", e);
			throw e;
		}
	}

	async deleteUser(username: string): Promise<void> {
		try {
			const allUsers = await this.getAll();
			const updatedUsers = allUsers.filter((u) => u.username !== username);
			await AsyncStorage.setItem(this.key, JSON.stringify(updatedUsers));
		} catch (e) {
			console.log("deleteUser error", e);
			throw e;
		}
	}
}

export default UsersAsyncStore;
