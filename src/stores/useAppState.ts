import { create } from "zustand";

interface AppState {
  redirectedToSadhana: boolean;
  setRedirectedToSadhana: (val: boolean) => void;
}

export const useAppState = create<AppState>((set) => ({
  redirectedToSadhana: false,
  setRedirectedToSadhana: (val) => set({ redirectedToSadhana: val }),
}));
