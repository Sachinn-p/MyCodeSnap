export type NodeType = "code" | "diff" | "terminal" | "text" | "api" | "database" | "profile";

export interface DiffNodeData {
  originalCode: string;
  modifiedCode: string;
  language: string;
  renderSideBySide: boolean;
  theme: "github-light" | "github-dark" | "vs-dark";
  windowStyle: "mac" | "windows" | "linux" | "none";
  title?: string;
  borderRadius?: number;
  dropShadow?: boolean;
}

export interface CanvasNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex: number;
  data: any; // Studio-specific data (CodeNodeData, DiffNodeData, etc)
}

export interface Point {
  x: number;
  y: number;
}
