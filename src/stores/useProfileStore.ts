import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProfileState {
  name: string;
  role: string;
  handle: string;
  avatarUrl: string;
  glassmorphism: boolean;
  theme: "dark" | "light";
  borderRadius: number;
  fontSize: number;
  showOnlineIndicator: boolean;
  avatarBorderColor: string;
  updateState: (updates: Partial<ProfileState>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: "Sachinn",
      role: "Frontend Engineer",
      handle: "@sachinn",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sachinn",
      glassmorphism: true,
      theme: "dark",
      borderRadius: 24,
      fontSize: 16,
      showOnlineIndicator: true,
      avatarBorderColor: "#6366f1", // blue-500
      updateState: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'mycodesnap-profile-storage',
    }
  )
);
