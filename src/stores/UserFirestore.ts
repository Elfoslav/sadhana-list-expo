// services/UserFirestore.ts
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import User from "../models/User";
import { dateReviver } from "../lib/functions";

class UserFirestore {
  async createUser(newUser: User) {
    try {
      const userRef = doc(db, "users", newUser.username);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await this.saveUser(newUser);
        return newUser;
      }
    } catch (error) {
      throw error;
    }
  }

  async getUser(username?: string) {
    if (!username) {
      return null;
    }

    try {
      const userRef = doc(db, "users", username || '');
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const user = userDoc.data();

        if (user && user.sadhanaData) {
          user.sadhanaData = JSON.parse(user.sadhanaData, dateReviver);
        }

        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async saveUser(user: User) {
    try {
      const userRef = doc(db, "users", user.username);
      await setDoc(userRef, {
        username: user.username,
        sadhanaData: JSON.stringify(user.sadhanaData),
      });
    } catch (error) {
      throw error;
    }
  }
}

export default UserFirestore;
