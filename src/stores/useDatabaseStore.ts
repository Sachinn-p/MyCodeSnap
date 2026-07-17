import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DatabaseState {
  tableName: string;
  schema: string;
  theme: "light" | "dark";
  windowStyle: "mac" | "windows" | "linux" | "none";
  borderRadius: number;
  dropShadow: boolean;
  fontSize: number;
  updateState: (updates: Partial<DatabaseState>) => void;
}

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set) => ({
      tableName: "users",
      schema: "id UUID PRIMARY KEY,\nemail VARCHAR(255) UNIQUE NOT NULL,\npassword_hash VARCHAR(255) NOT NULL,\ncreated_at TIMESTAMP DEFAULT NOW(),\nis_active BOOLEAN DEFAULT true",
      theme: "dark",
      windowStyle: "mac",
      borderRadius: 12,
      dropShadow: true,
      fontSize: 14,
      updateState: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'mycodesnap-db-storage',
    }
  )
);
