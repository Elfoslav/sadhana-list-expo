import User from "../models/User";
import UserAsyncStore from "../stores/UserAsyncStore";
import UserFirestore from "../stores/UserFirestore";

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
			const user = (await this.userFirestore.getUser(username)) as User;
			const localUser = (await this.userStore.getUser(username)) as User;
			return user?.sadhanaData?.length > localUser?.sadhanaData?.length
				? user
				: localUser;
		} catch (error) {
			throw error;
		}
	}

	// Method to write user data
	async saveUser(user: User) {
		try {
			// Backup data in firestore DB
			this.userFirestore.saveUser(user);
			return await this.userStore.saveUser(user);
		} catch (error) {
			console.log("saveUser error", error);
			throw error;
		}
	}
}

export default UsersService;
