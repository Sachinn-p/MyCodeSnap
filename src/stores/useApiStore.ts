import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ApiState {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  statusCode: number;
  time: string;
  size: string;
  requestBody: string;
  responseBody: string;
  apiLayout: "response-only" | "request-only" | "split" | "tabs";
  activeTab: "request" | "response";
  theme: "light" | "dark";
  windowStyle: "mac" | "windows" | "linux" | "none";
  borderRadius: number;
  dropShadow: boolean;
  padding: number;
  fontSize: number;
  updateState: (updates: Partial<ApiState>) => void;
}

export const useApiStore = create<ApiState>()(
  persist(
    (set) => ({
      method: "GET",
      url: "https://api.mycodesnap.dev/v1/users",
      statusCode: 200,
      time: "124 ms",
      size: "2.4 KB",
      requestBody: '{\n  "userId": 123,\n  "includeMeta": true\n}',
      responseBody: '{\n  "status": "success",\n  "data": {\n    "users": [\n      { "id": 1, "name": "Alice" },\n      { "id": 2, "name": "Bob" }\n    ]\n  }\n}',
      apiLayout: "response-only",
      activeTab: "response",
      theme: "dark",
      windowStyle: "mac",
      borderRadius: 12,
      dropShadow: true,
      padding: 32,
      fontSize: 14,
      updateState: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'mycodesnap-api-storage',
    }
  )
);
