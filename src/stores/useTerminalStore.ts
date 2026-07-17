import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Resolution } from "../types";

export type TerminalTheme = "hyper" | "warp" | "iterm" | "ubuntu" | "windows";
export type TerminalShell = "bash" | "zsh" | "powershell" | "cmd" | "fish";

export interface TerminalState {
  commands: { id: string; prompt: string; command: string; output: string }[];
  theme: TerminalTheme;
  shell: TerminalShell;
  padding: number;
  borderRadius: number;
  dropShadow: boolean;
  resolution: Resolution;
  customWidth: number;
  customHeight: number;
  showFooter: boolean;
  watermark: boolean;
  author: string;
  updateState: (updates: Partial<TerminalState>) => void;
  updateCommand: (id: string, updates: any) => void;
  addCommand: () => void;
  removeCommand: (id: string) => void;
}

const defaultCommands = [
  { id: "1", prompt: "~/mycodesnap $", command: "npm run build", output: "vite v8.1.4 building for production...\\n✓ 2504 modules transformed.\\nbuilt in 1.25s." },
  { id: "2", prompt: "~/mycodesnap $", command: "git status", output: "On branch main\\nnothing to commit, working tree clean" }
];

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      commands: defaultCommands,
  theme: "hyper",
  shell: "bash",
  padding: 64,
  borderRadius: 12,
  dropShadow: true,
  resolution: "1080x1080",
  customWidth: 1080,
  customHeight: 1080,
  showFooter: true,
  watermark: true,
  author: "Sachinn",
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
  updateCommand: (id, updates) => set((state) => ({
    commands: state.commands.map(cmd => cmd.id === id ? { ...cmd, ...updates } : cmd)
  })),
  addCommand: () => set((state) => ({
    commands: [...state.commands, { id: Math.random().toString(), prompt: "~/mycodesnap $", command: "", output: "" }]
  })),
  removeCommand: (id) => set((state) => ({
    commands: state.commands.filter(cmd => cmd.id !== id)
  })),
    }),
    {
      name: 'mycodesnap-terminal-storage',
    }
  )
);
