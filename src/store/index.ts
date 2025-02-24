import { create } from "zustand";

interface IUserStore {
  username: string;
  tonWalletAddress: string;
  avatar: string;
  setUsername: (username: string) => void;
  setTonWalletAddress: (tonWalletAddress: string) => void;
  setAvatar: (avatar: string) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  username: "",
  tonWalletAddress: "",
  avatar: "",
  setUsername: (username: string) => set({ username }),
  setTonWalletAddress: (tonWalletAddress: string) => set({ tonWalletAddress }),
  setAvatar: (avatar: string) => set({ avatar }),
}));
