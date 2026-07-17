import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Resolution } from "../types";

export type WindowStyle = "mac" | "windows" | "linux" | "minimal" | "none";
export type BackgroundStyle = "gradient" | "solid" | "glass" | "blur";

export interface CodeState {
  code: string;
  language: string;
  theme: string;
  windowStyle: WindowStyle;
  backgroundStyle: BackgroundStyle;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  dropShadow: boolean;
  fontFamily: string;
  fontLigatures: boolean;
  lineNumbers: boolean;
  fontSize: number;
  resolution: Resolution;
  customWidth: number;
  customHeight: number;
  showFooter: boolean;
  watermark: boolean;
  author: string;
  updateState: (updates: Partial<CodeState>) => void;
}

export const useCodeStore = create<CodeState>()(
  persist(
    (set) => ({
      code: `// MyCodeSnap Snapshot\n\nfunction calculateVelocity(distance: number, time: number) {\n  if (time === 0) return 0;\n  return distance / time;\n}\n\nconsole.log(calculateVelocity(100, 10));`,
  language: "typescript",
  theme: "vs-dark",
  windowStyle: "mac",
  backgroundStyle: "gradient",
  backgroundColor: "from-stone-700 to-stone-900",
  padding: 64,
  borderRadius: 16,
  dropShadow: true,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  fontLigatures: true,
  lineNumbers: true,
  fontSize: 16,
  resolution: "1080x1080",
  customWidth: 1080,
  customHeight: 1080,
  showFooter: true,
  watermark: true,
  author: "Sachinn",
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'mycodesnap-code-storage',
    }
  )
);
