import SadhanaData from "./SadhanaData";

interface User {
  username: string;
  pin?: string;
  sadhanaData: SadhanaData[];
}

export default User;