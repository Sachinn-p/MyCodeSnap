import { create } from "zustand";
import type { DiffTheme, Resolution, QrType } from "../types";

export interface DiffState {
  beforeCode: string;
  afterCode: string;
  fileName: string;
  commitTitle: string;
  description: string;
  author: string;
  github: string;
  company: string;
  date: string;
  theme: DiffTheme;
  resolution: Resolution;
  customWidth: number;
  customHeight: number;
  qrEnabled: boolean;
  qrType: QrType;
  qrUrl: string;
  snapcodeImage: string | null;
  qrSize: number;
  qrBorderRadius: number;
  showFooter: boolean;
  watermark: boolean;
  updateState: (updates: Partial<DiffState>) => void;
}

export const useDiffStore = create<DiffState>((set) => ({
  beforeCode: `function greet() {\n  console.log("Hello, World!");\n}`,
  afterCode: `function greet(name: string) {\n  console.log(\`Hello, \${name}!\`);\n}`,
  fileName: "src/utils/greet.ts",
  commitTitle: "feat: update greet function",
  description: "Made the greet function dynamic to accept a name parameter.",
  author: "Sachinn",
  github: "@sachinn-p",
  company: "DuroPOS",
  date: new Date().toISOString().split("T")[0],
  theme: "dark",
  resolution: "1200x627",
  customWidth: 1200,
  customHeight: 627,
  qrEnabled: true,
  qrType: "linkedin",
  qrUrl: "https://linkedin.com/in/sachinn",
  snapcodeImage: null,
  qrSize: 120,
  qrBorderRadius: 16,
  showFooter: true,
  watermark: true,
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
}));
