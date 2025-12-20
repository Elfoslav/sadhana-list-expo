import { Timestamp } from "firebase/firestore";
import SadhanaData from "./SadhanaData";

interface User {
	username: string;
	pin?: string;
	sadhanaData: SadhanaData[];
	updatedAt?: Timestamp;
}

export default User;
