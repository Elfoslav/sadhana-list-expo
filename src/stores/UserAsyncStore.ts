import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/User';
import { dateReviver } from '../lib/functions';

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

      console.log('user not found');
      return null;
    } catch (e) {
      console.log(e)
      throw e;
    }
  }

  // Method to write user data
  async saveUser(user: User) {
    try {
      await AsyncStorage.setItem(user.username, JSON.stringify(user))
    } catch (error) {
      console.log('saveUser error', error);
      throw error;
    }
  }
}

export default UserAsyncStore;