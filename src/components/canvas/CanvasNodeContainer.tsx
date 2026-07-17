import React, { useRef } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useCanvasStore } from "../../stores/useCanvasStore";
import type { CanvasNode } from "../../types/canvas";
import CodePreviewCard from "../preview/CodePreviewCard";
import TextPreviewCard from "../preview/TextPreviewCard";
import DiffPreviewCard from "../preview/DiffPreviewCard";
import TerminalPreviewCard from "../preview/TerminalPreviewCard";
import APIPreviewCard from "../preview/APIPreviewCard";
import DatabasePreviewCard from "../preview/DatabasePreviewCard";
import ProfilePreviewCard from "../preview/ProfilePreviewCard";

interface Props {
  node: CanvasNode;
}

export default function CanvasNodeContainer({ node }: Props) {
  const { updateNode, setSelectedNode, selectedNodeId } = useCanvasStore();
  const isSelected = selectedNodeId === node.id;
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef(false);
  const isResizing = useRef<string | null>(null);
  const startMousePoint = useRef({ x: 0, y: 0 }); // Mouse position at start of drag/resize
  const initialRect = useRef({ x: 0, y: 0, w: 0, h: 0 }); // Node rect at start of drag/resize

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Prevent canvas from dragging
    setSelectedNode(node.id);
    
    const target = e.target as HTMLElement;
    const resizeHandle = target.getAttribute('data-resize-handle');
    
    if (resizeHandle) {
      isResizing.current = resizeHandle;
      startMousePoint.current = { x: e.clientX, y: e.clientY };
      const zoom = useCanvasStore.getState().zoom;
      const rect = nodeRef.current?.getBoundingClientRect();
      initialRect.current = {
        x: node.x,
        y: node.y,
        w: node.width || (rect ? rect.width / zoom : 600),
        h: node.height || (rect ? rect.height / zoom : 400)
      };
      nodeRef.current?.setPointerCapture(e.pointerId);
    } else {
      isDragging.current = true;
      startMousePoint.current = { x: e.clientX, y: e.clientY };
      initialRect.current = { x: node.x, y: node.y, w: 0, h: 0 };
      nodeRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const zoom = useCanvasStore.getState().zoom;
    
    if (isDragging.current) {
      const dx = (e.clientX - startMousePoint.current.x) / zoom;
      const dy = (e.clientY - startMousePoint.current.y) / zoom;
      
      let newX = initialRect.current.x + dx;
      let newY = initialRect.current.y + dy;
      
      const snapToGrid = useCanvasStore.getState().canvasSettings.snapToGrid;
      if (snapToGrid) {
        newX = Math.round(newX / 20) * 20;
        newY = Math.round(newY / 20) * 20;
      }
      
      updateNode(node.id, {
        x: newX,
        y: newY,
      });
    } else if (isResizing.current) {
      const dx = (e.clientX - startMousePoint.current.x) / zoom;
      const dy = (e.clientY - startMousePoint.current.y) / zoom;
      
      let { x, y, w, h } = initialRect.current;
      const dir = isResizing.current;
      
      if (dir.includes('e')) w += dx;
      if (dir.includes('s')) h += dy;
      if (dir.includes('w')) { w -= dx; x += dx; }
      if (dir.includes('n')) { h -= dy; y += dy; }
      
      // minimum bounds
      if (w < 200) { if (dir.includes('w')) x += (w - 200); w = 200; }
      if (h < 100) { if (dir.includes('n')) y += (h - 100); h = 100; }
      
      const snapToGrid = useCanvasStore.getState().canvasSettings.snapToGrid;
      if (snapToGrid) {
        w = Math.round(w / 20) * 20;
        h = Math.round(h / 20) * 20;
      }

      updateNode(node.id, { x, y, width: w, height: h });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    isResizing.current = null;
    nodeRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -30, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      ref={nodeRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute pointer-events-auto transition-shadow ${
        isSelected ? "ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20 z-50" : "z-10"
      }`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        zIndex: node.zIndex,
      }}
    >
      <div 
        data-drag-handle
        className="absolute -top-8 left-0 right-0 h-8 bg-neutral-800/80 rounded-t-md opacity-0 hover:opacity-100 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing text-xs text-neutral-400 font-semibold select-none"
      >
        <span className="flex-1 text-center pointer-events-none">Drag</span>
        <div className="flex items-center gap-1">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={async (e) => {
              e.stopPropagation();
              const el = nodeRef.current;
              if (!el) return;
              try {
                const dataUrl = await toPng(el, { pixelRatio: 2, skipFonts: false });
                const link = document.createElement('a');
                link.download = `mycodesnap-node-${node.id.split('-')[0]}.png`;
                link.href = dataUrl;
                link.click();
              } catch (err) {
                console.error('Failed to export node', err);
              }
            }}
            className="p-1 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-md transition-colors pointer-events-auto"
            title="Export Node as PNG"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              useCanvasStore.getState().removeNode(node.id);
            }}
            className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors pointer-events-auto"
            title="Delete Node"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      
      {isSelected && (
        <>
          <div data-resize-handle="nw" className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-nwse-resize z-50" />
          <div data-resize-handle="n" className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-ns-resize z-50" />
          <div data-resize-handle="ne" className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-nesw-resize z-50" />
          <div data-resize-handle="e" className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-ew-resize z-50" />
          <div data-resize-handle="se" className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-nwse-resize z-50" />
          <div data-resize-handle="s" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-ns-resize z-50" />
          <div data-resize-handle="sw" className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-nesw-resize z-50" />
          <div data-resize-handle="w" className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-500 border border-white rounded-sm cursor-ew-resize z-50" />
        </>
      )}

      {node.type === "code" && (
        <CodePreviewCard node={node} />
      )}
      {node.type === "text" && (
        <TextPreviewCard node={node} />
      )}
      {node.type === "diff" && (
        <DiffPreviewCard node={node} />
      )}
      {node.type === "terminal" && (
        <TerminalPreviewCard node={node} />
      )}
      {node.type === "api" && (
        <APIPreviewCard node={node} />
      )}
      {node.type === "database" && (
        <DatabasePreviewCard node={node} />
      )}
      {node.type === "profile" && (
        <ProfilePreviewCard node={node} />
      )}
    </motion.div>
  );
}
