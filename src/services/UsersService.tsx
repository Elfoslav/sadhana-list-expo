import User from "../models/User";
import UserAsyncStore from "../stores/UserAsyncStore";
import UserFirestore from "../stores/UserFirestore";
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
				networkState.isConnected && networkState.isInternetReachable;

			// Load user from firebase only when connected to the internet
			if (isConnected) {
				const user = (await this.userFirestore.getUser(username)) as User;
				const localUser = (await this.userStore.getUser(username)) as User;
				return user?.sadhanaData?.length > localUser?.sadhanaData?.length
					? user
					: localUser;
			}

			return (await this.userStore.getUser(username)) as User;
		} catch (error) {
			throw error;
		}
	}

	// Method to write user data
	async saveUser(user: User) {
		try {
			const networkState = await Network.getNetworkStateAsync();
			const isConnected =
				networkState.isConnected && networkState.isInternetReachable;

			if (isConnected) {
				// Backup data in firestore DB
				this.userFirestore.saveUser(user);
			}

			return await this.userStore.saveUser(user);
		} catch (error) {
			console.log("saveUser error", error);
			throw error;
		}
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
