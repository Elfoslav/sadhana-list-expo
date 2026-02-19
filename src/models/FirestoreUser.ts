import { Timestamp } from "firebase/firestore";

interface User {
	username: string;
	pin?: string;
	sadhanaData: string;
	updatedAt?: Timestamp;
	lastBedTime?: number | null;
	lastWakeUpTime?: number | null;
}

export default User;
