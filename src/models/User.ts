import { Timestamp } from "firebase/firestore";
import SadhanaData from "./SadhanaData";

interface User {
	username: string;
	pin?: string;
	sadhanaData: SadhanaData[];
	updatedAt?: Timestamp;
	lastBedTime?: number | null;
	lastWakeUpTime?: number | null;
}

export default User;
