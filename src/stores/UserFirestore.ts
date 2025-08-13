// services/UserFirestore.ts
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit as limitFn,
  startAt,
  endAt,
  Timestamp
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

  async getUsers(username?: string, limitCount: number = 10) {
    try {
      const usersRef = collection(db, "users");
      let q;

      if (username) {
        // Prefix search: orderBy + startAt/endAt
        q = query(
          usersRef,
          orderBy("username"),
          startAt(username),
          endAt(username + "\uf8ff"),
          limitFn(limitCount)
        );
      } else {
        // Just limit without filtering
        q = query(usersRef, orderBy("username"), limitFn(limitCount));
      }

      const snapshot = await getDocs(q);
      const users = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        if (data.sadhanaData) {
          data.sadhanaData = JSON.parse(data.sadhanaData, dateReviver);
        }

        return data;
      });

      return users;
    } catch (error) {
      throw error;
    }
  }

  async saveUser(user: User) {
    try {
      const userRef = doc(db, "users", user.username);
      const userDoc: {
        username: string;
        sadhanaData: string;
        pin?: string;
        updatedAt?: Timestamp;
      } = {
        username: user.username,
        sadhanaData: JSON.stringify(user.sadhanaData),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      if (user.pin) {
        userDoc.pin = user.pin;
      }

      await setDoc(userRef, userDoc);
    } catch (error) {
      throw error;
    }
  }
}

export default UserFirestore;
