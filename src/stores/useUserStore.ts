// stores/useUserStore.ts
import { create } from "zustand";
import User from "../models/User";

interface UserStore {
	user: User | null; // merged from local & Firebase
	localUser: User | null; // from local storage
	remoteUser: User | null; // from Firebase
	setUser: (user: User) => void;
	setLocalUser: (user: User) => void;
	setRemoteUser: (user: User) => void;
	updateUser: (updatedFields: Partial<User>) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	localUser: null,
	remoteUser: null,
	setUser: (user) => set({ user }),
	setLocalUser: (localUser) => set({ localUser }),
	setRemoteUser: (remoteUser) => set({ remoteUser }),
	updateUser: (updatedFields) =>
		set((state) => ({
			user: state.user ? { ...state.user, ...updatedFields } : null,
		})),
	clearUser: () => set({ user: null }),
}));
