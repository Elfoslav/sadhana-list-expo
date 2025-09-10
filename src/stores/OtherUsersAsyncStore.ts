import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/User';
import { dateReviver } from '../lib/functions';

const KEY = 'other_users';

class OtherUsersAsyncStore {

  // Create a new user (if username doesn't exist)
  async createUser(newUser: User): Promise<User | null> {
    try {
      const allUsers = await this.getAll();
      const exists = allUsers.find(u => u.username === newUser.username);

      if (!exists) {
        const updatedUsers = [...allUsers, newUser];
        await AsyncStorage.setItem(KEY, JSON.stringify(updatedUsers));
        return newUser;
      }

      return null; // user already exists
    } catch (e) {
      console.log('createUser error', e);
      throw e;
    }
  }

  // Get all stored users
  async getAll(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(KEY);
      if (data) {
        return JSON.parse(data, dateReviver) as User[];
      }
      return [];
    } catch (e) {
      console.log('getAll error', e);
      throw e;
    }
  }

  // Get a specific user by username
  async getUser(username: string): Promise<User | null> {
    try {
      const allUsers = await this.getAll();
      const user = allUsers.find(u => u.username === username);
      return user || null;
    } catch (e) {
      console.log('getUser error', e);
      throw e;
    }
  }

  // Save/update a user
  async saveUser(user: User): Promise<void> {
    try {
      const allUsers = await this.getAll();
      const index = allUsers.findIndex(u => u.username === user.username);

      if (index >= 0) {
        allUsers[index] = user; // update existing
      } else {
        allUsers.push(user); // add new
      }

      await AsyncStorage.setItem(KEY, JSON.stringify(allUsers));
    } catch (e) {
      console.log('saveUser error', e);
      throw e;
    }
  }

  async saveUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(users));
    } catch (e) {
      console.log('createUser error', e);
      throw e;
    }
  }

  // Optional: delete a user
  async deleteUser(username: string): Promise<void> {
    try {
      const allUsers = await this.getAll();
      const updatedUsers = allUsers.filter(u => u.username !== username);
      await AsyncStorage.setItem(KEY, JSON.stringify(updatedUsers));
    } catch (e) {
      console.log('deleteUser error', e);
      throw e;
    }
  }
}

export default new OtherUsersAsyncStore();
