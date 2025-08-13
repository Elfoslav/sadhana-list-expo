import { encryptPin } from "../lib/functions";
import User from "../models/User";
import UserAsyncStore from "../stores/UserAsyncStore";
import UserFirestore from "../stores/UserFirestore";
import { useUserStore } from "../stores/useUserStore";
import * as Network from "expo-network";

class UsersService {
	// Main local store
	private userStore;
	// Backup online store
	private userFirestore;

	constructor() {
		this.userStore = new UserAsyncStore();
		this.userFirestore = new UserFirestore();
	}

	async createUser(newUser: User) {
		try {
			const createdUser = await this.userStore.createUser(newUser);
			// Do not wait for firestore
			this.userFirestore.createUser(newUser);
			return createdUser;
		} catch (error) {
			throw error;
		}
	}

	// Method to read user data
	async getUser(username?: string) {
		try {
			const networkState = await Network.getNetworkStateAsync();
			const isConnected =
				networkState.isConnected === true &&
				networkState.isInternetReachable === true;

			// Load user from firebase only when connected to the internet
			if (isConnected) {
				const user = (await this.userFirestore.getUser(
					username
				)) as User | null; // Set User type instead of DocumentData from Firebase
				const localUser = await this.userStore.getUser(username);

				const userSadhanaLength = user?.sadhanaData?.length ?? 0;
				const localUserSadhanaLength = localUser?.sadhanaData?.length ?? 0;

				return userSadhanaLength > localUserSadhanaLength ? user : localUser;
			}

			return await this.userStore.getUser(username);
		} catch (error) {
			console.error("Error in getUser:", error);
			return await this.userStore.getUser(username); // fallback
		}
	}

	async getRemoteUser(username?: string) {
		try {
			return (await this.userFirestore.getUser(username)) as User | null;
		} catch (error) {
			console.error("Error in getUser:", error);
			return await this.userStore.getUser(username); // fallback
		}
	}

	async getUsers(username?: string) {
		const docs = await this.userFirestore.getUsers(username);
		return docs as User[];
	}

	async getLocalUser(username?: string) {
		return await this.userStore.getUser(username);
	}

	// Method to write user data
	async saveUser(user: User) {
		try {
			const networkState = await Network.getNetworkStateAsync();
			const isConnected =
				networkState.isConnected && networkState.isInternetReachable;

			if (isConnected) {
				console.log("savingu ser in Firebase: ", user.pin, user);
				// Backup data in firestore DB
				this.userFirestore.saveUser(user);
			}

			return await this.userStore.saveUser(user);
		} catch (error) {
			console.log("saveUser error", error);
			throw error;
		}
	}

	async savePin(user: User, pin: string) {
		if (pin.length === 4) {
			user.pin = encryptPin(pin);
		} else {
			user.pin = pin; // already encrypted PIN
		}

		await this.saveUser(user);
		useUserStore.setState({ user });
	}

	async saveUsername(username: string) {
		try {
			return await this.userStore.saveUsername(username);
		} catch (error) {
			console.log("saveUsername error", error);
			throw error;
		}
	}

	async getUsername() {
		try {
			return await this.userStore.getUsername();
		} catch (error) {
			console.log("saveUsername error", error);
			throw error;
		}
	}
}

export default UsersService;
