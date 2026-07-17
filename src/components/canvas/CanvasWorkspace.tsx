import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCanvasStore } from "../../stores/useCanvasStore";
import CanvasNodeContainer from "./CanvasNodeContainer";
import { Plus, Terminal, Database, Globe, UserCircle2, Code } from "lucide-react";

export default function CanvasWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pan, zoom, nodes, setPan, setZoom, setSelectedNode, canvasSettings } = useCanvasStore();

  const isDragging = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  // Fit the export frame to the viewport — always run on mount so stale
  // persisted zoom/pan values don't leave the canvas off-screen.
  const fitToViewport = () => {
    if (!containerRef.current) return;
    const { offsetWidth: vw, offsetHeight: vh } = containerRef.current;
    const { width, height } = useCanvasStore.getState().canvasSettings;
    const z = Math.min(vw / width, vh / height) * 0.85; // 85% to give breathing room
    setZoom(z);
    setPan({
      x: (vw - width * z) / 2,
      y: (vh - height * z) / 2,
    });
  };

  useEffect(() => {
    fitToViewport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.ctrlKey || e.metaKey) {
        // Zoom
        const zoomDelta = e.deltaY * -0.005;
        setZoom((z) => z + zoomDelta);
      } else {
        // Pan
        setPan((p) => ({
          x: p.x - e.deltaX,
          y: p.y - e.deltaY,
        }));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isEditing = activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable;

      const selectedId = useCanvasStore.getState().selectedNodeId;
      if ((e.key === "Delete" || e.key === "Backspace") && !isEditing) {
        if (selectedId) useCanvasStore.getState().removeNode(selectedId);
      }
      
      // Duplicate Node (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && !isEditing) {
        e.preventDefault();
        if (selectedId) useCanvasStore.getState().duplicateNode(selectedId);
      }

      // F = fit canvas to viewport
      if (e.key === "f" || e.key === "F") {
        if (!isEditing) fitToViewport();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setPan, setZoom]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || e.target === containerRef.current || (e.target as HTMLElement).id === 'export-frame') {
      isDragging.current = true;
      lastPoint.current = { x: e.clientX, y: e.clientY };
      containerRef.current?.setPointerCapture(e.pointerId);
      
      if (e.target === containerRef.current || (e.target as HTMLElement).id === 'export-frame') {
        setSelectedNode(null);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - lastPoint.current.x;
      const dy = e.clientY - lastPoint.current.y;
      
      setPan((p) => ({
        x: p.x + dx,
        y: p.y + dy,
      }));
      
      lastPoint.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  const getBackgroundClass = () => {
    if (canvasSettings.backgroundStyle === 'solid') return 'bg-neutral-900';
    if (canvasSettings.backgroundStyle === 'transparent') return 'bg-transparent';
    if (canvasSettings.backgroundStyle === 'custom-gradient') return '';
    return `bg-gradient-to-br ${canvasSettings.backgroundColor}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      ref={containerRef}
      className="w-full h-full bg-[#0a0a0a] overflow-clip relative cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`
      }}
    >
      <div
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* Export Frame (Canvas bounds) */}
        <div
          id="export-frame"
          className={`absolute pointer-events-auto shadow-2xl transition-all overflow-clip ${getBackgroundClass()}`}
          style={{
            width: canvasSettings?.width || 1080,
            height: canvasSettings?.height || 1080,
            left: 0, 
            top: 0,
            ...(canvasSettings.backgroundStyle === 'custom-gradient' 
                ? { backgroundImage: `linear-gradient(to bottom right, ${canvasSettings.customGradientStart}, ${canvasSettings.customGradientEnd})` } 
                : {})
          }}
        >
          {canvasSettings.backgroundStyle === 'glass' && (
            <div className="absolute inset-0 backdrop-blur-3xl bg-white/5 pointer-events-none" />
          )}

          {/* Render nodes inside the export frame so they get captured */}
          <AnimatePresence>
            {nodes.map((node) => (
              <CanvasNodeContainer key={node.id} node={node} />
            ))}
          </AnimatePresence>

          {/* Empty State Overlay */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="pointer-events-auto flex flex-col items-center bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm text-center"
              >
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4 border border-neutral-700">
                  <Plus className="text-neutral-400" size={24} />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Canvas is empty</h2>
                <p className="text-sm text-neutral-400 mb-6">Start building your dev snap by adding a node to the canvas.</p>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button onClick={() => useCanvasStore.getState().addNode({ type: "code", x: canvasSettings.width / 2 - 200, y: canvasSettings.height / 2 - 100, data: {} })} className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">
                    <Code size={16} /> Code
                  </button>
                  <button onClick={() => useCanvasStore.getState().addNode({ type: "terminal", x: canvasSettings.width / 2 - 200, y: canvasSettings.height / 2 - 100, data: {} })} className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">
                    <Terminal size={16} /> Terminal
                  </button>
                  <button onClick={() => useCanvasStore.getState().addNode({ type: "api", x: canvasSettings.width / 2 - 250, y: canvasSettings.height / 2 - 150, data: {} })} className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">
                    <Globe size={16} /> API
                  </button>
                  <button onClick={() => useCanvasStore.getState().addNode({ type: "database", x: canvasSettings.width / 2 - 250, y: canvasSettings.height / 2 - 150, data: {} })} className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">
                    <Database size={16} /> DB
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>


    </motion.div>
  );
}
