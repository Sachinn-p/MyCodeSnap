import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CanvasNode, Point } from "../types/canvas";

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundStyle: "solid" | "gradient" | "glass" | "transparent" | "custom-gradient";
  backgroundColor: string; // Used for solid or gradient classes
  customGradientStart: string;
  customGradientEnd: string;
  padding: number;
  snapToGrid: boolean;
}

interface CanvasState {
  pan: Point;
  zoom: number;
  nodes: CanvasNode[];
  selectedNodeId: string | null;
  canvasSettings: CanvasSettings;
  
  // Actions
  setPan: (pan: Point | ((prev: Point) => Point)) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  addNode: (node: Omit<CanvasNode, "id" | "zIndex">) => void;
  updateNode: (id: string, data: Partial<CanvasNode>) => void;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      pan: { x: 0, y: 0 },
  zoom: 1,
  nodes: [],
  selectedNodeId: null,
  canvasSettings: {
    width: 1080,
    height: 1080,
    backgroundStyle: "gradient",
    backgroundColor: "from-orange-400 to-rose-400",
    customGradientStart: "#fb923c",
    customGradientEnd: "#fb7185",
    padding: 64,
    snapToGrid: false,
  },

  setPan: (pan) =>
    set((state) => ({
      pan: typeof pan === "function" ? pan(state.pan) : pan,
    })),

  setZoom: (zoom) =>
    set((state) => {
      const nextZoom = typeof zoom === "function" ? zoom(state.zoom) : zoom;
      return { zoom: Math.max(0.1, Math.min(nextZoom, 5)) }; // clamp zoom between 0.1x and 5x
    }),

  addNode: (node) =>
    set((state) => {
      const id = crypto.randomUUID();
      const zIndex = state.nodes.length;
      return {
        nodes: [...state.nodes, { ...node, id, zIndex }],
        selectedNodeId: id, // auto-select new node
      };
    }),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  duplicateNode: (id) =>
    set((state) => {
      const nodeToDuplicate = state.nodes.find(n => n.id === id);
      if (!nodeToDuplicate) return state;
      
      const newId = crypto.randomUUID();
      const zIndex = state.nodes.length;
      
      // Offset slightly so it doesn't perfectly overlap
      const newNode = {
        ...nodeToDuplicate,
        id: newId,
        zIndex,
        x: nodeToDuplicate.x + 40,
        y: nodeToDuplicate.y + 40,
      };
      
      return {
        nodes: [...state.nodes, newNode],
        selectedNodeId: newId,
      };
    }),

  setSelectedNode: (id) => set({ selectedNodeId: id }),

    updateCanvasSettings: (settings) =>
      set((state) => ({
        canvasSettings: { ...state.canvasSettings, ...settings },
      })),
    }),
    {
      name: 'mycodesnap-canvas-storage',
      merge: (persistedState: any, currentState: CanvasState) => ({
        ...currentState,
        ...persistedState,
        canvasSettings: {
          ...currentState.canvasSettings,
          ...(persistedState?.canvasSettings || {}),
        }
      }),
    }
  )
);
