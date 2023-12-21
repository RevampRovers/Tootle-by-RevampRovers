import { create } from "zustand";
import authStorage, { langToIndex } from "../auth/storage";

interface BearState {
  language: keyof typeof langToIndex;
  setLanguage: (language: keyof typeof langToIndex) => void;
}

export const useBearStore = create<BearState>()((set) => ({
  language: "en",
  setLanguage: (language) => {
    authStorage.setLanguage(language);
    set({ language });
  },
}));
