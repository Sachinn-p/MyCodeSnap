import { useState, useRef, useEffect } from "react";
import CanvasWorkspace from "../components/canvas/CanvasWorkspace";
import { useCanvasStore } from "../stores/useCanvasStore";
import CodeSettingsPanel from "../components/settings/CodeSettingsPanel";
import CanvasSettingsPanel from "../components/settings/CanvasSettingsPanel";
import CodeEditorPanel from "../components/editor/CodeEditorPanel";
import DiffSettingsPanel from "../components/settings/DiffSettingsPanel";
import TerminalSettingsPanel from "../components/settings/TerminalSettingsPanel";
import TextSettingsPanel from "../components/settings/TextSettingsPanel";
import APISettingsPanel from "../components/settings/APISettingsPanel";
import DatabaseSettingsPanel from "../components/settings/DatabaseSettingsPanel";
import ProfileSettingsPanel from "../components/settings/ProfileSettingsPanel";
import { Plus, Download, Trash2, Terminal, ArrowUpToLine, ArrowDownToLine, ArrowUp, ArrowDown, Database, Globe, UserCircle2, Maximize2, ZoomIn, ZoomOut, Focus, Keyboard, X, Copy } from "lucide-react";
import { Tooltip } from "../components/ui/Tooltip";
import { toCanvas, toSvg, getFontEmbedCSS } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";


export default function CanvasEditor() {
  const { addNode, nodes, selectedNodeId, canvasSettings } = useCanvasStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const [sidebarWidth, setSidebarWidth] = useState(340);

  // Removed auto-add default node to allow completely empty canvas



  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  // Cache font CSS after first warm-up so exports don't re-fetch fonts via XHR.
  const fontCSSRef = useRef<string | null>(null);

  // Pre-warm: fetch and embed all @font-face fonts once on mount in the background.
  // Subsequent exports reuse this cached string — the main source of export slowness.
  useEffect(() => {
    let cancelled = false;
    const warmFonts = async () => {
      // Wait for the frame to be in the DOM
      await new Promise(r => setTimeout(r, 500));
      const frame = document.getElementById('export-frame') as HTMLElement | null;
      if (!frame || cancelled) return;
      try {
        fontCSSRef.current = await getFontEmbedCSS(frame);
      } catch {
        // non-fatal: export will fall back to re-fetching
      }
    };
    warmFonts();
    return () => { cancelled = true; };
  }, []);

  // Get the export-frame element, deselect nodes, and wait for DOM to settle.
  const prepareExport = async (): Promise<HTMLElement | null> => {
    useCanvasStore.getState().setSelectedNode(null);
    await new Promise(r => setTimeout(r, 100));
    return document.getElementById('export-frame') as HTMLElement | null;
  };

  // Shared options passed to every toCanvas / toSvg call.
  const getImgOptions = (source: HTMLElement, pixelRatio: number) => ({
    pixelRatio,
    width: source.offsetWidth,
    height: source.offsetHeight,
    skipFonts: false,
    cacheBust: false,          // avoid cache-busting query params on every resource
    includeQueryParams: false,
    style: { transform: 'none' },
    // Reuse pre-warmed font CSS if available, otherwise html-to-image fetches it fresh
    ...(fontCSSRef.current ? { fontEmbedCSS: fontCSSRef.current } : {}),
  });

  // Core: render DOM to canvas ONCE, then derive formats from that single canvas.
  const getCanvas = (source: HTMLElement, pixelRatio: number) =>
    toCanvas(source, getImgOptions(source, pixelRatio));

  const download = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.click();
  };

  const handleExport = async (format: 'png-1x' | 'png-2x' | 'jpeg' | 'pdf' | 'svg') => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const source = await prepareExport();
      if (!source) return;

      if (format === 'svg') {
        const svg = await toSvg(source, getImgOptions(source, 1));
        download(svg, 'mycodesnap-export.svg');
        return;
      }

      const canvas = await getCanvas(source, format === 'png-1x' ? 1 : 2);

      if (format === 'png-1x' || format === 'png-2x') {
        download(canvas.toDataURL('image/png'), 'mycodesnap-export.png');
      } else if (format === 'jpeg') {
        download(canvas.toDataURL('image/jpeg', 0.95), 'mycodesnap-export.jpg');
      } else if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const w = source.offsetWidth;
        const h = source.offsetHeight;
        // Landscape if wider than tall, portrait otherwise
        const orientation = w >= h ? 'landscape' : 'portrait';
        const pdf = new jsPDF({ orientation, unit: 'px', format: [w, h], hotfixes: ['px_scaling'] });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
        pdf.save('mycodesnap-export.pdf');
      }
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950">
      {/* Top Toolbar */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-14 border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)] bg-neutral-900">
              <img src="/logo.png" alt="MyCodeSnap Logo" className="w-full h-full object-cover scale-[1.02]" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-neutral-200">
              MyCode<span className="text-neutral-500 font-medium">Snap</span>
            </h1>
          </div>
          
          <div className="h-4 w-px bg-white/10 mx-2" />
          
          {/* Add node buttons — grouped as a cluster */}
          <div className="flex items-center gap-1">
            <Tooltip content="Add Code node" side="bottom">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addNode({ type: "code", x: (canvasSettings?.width || 1080) / 2 - 200, y: (canvasSettings?.height || 1080) / 2 - 100, data: {} })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={14} /> Code
              </motion.button>
            </Tooltip>
            <Tooltip content="Add Text node" side="bottom">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addNode({ type: "text", x: (canvasSettings?.width || 1080) / 2, y: (canvasSettings?.height || 1080) / 2, data: {} })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={14} /> Text
              </motion.button>
            </Tooltip>
            <Tooltip content="Add Git Diff node" side="bottom">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addNode({ type: "diff", x: (canvasSettings?.width || 1080) / 2 - 250, y: (canvasSettings?.height || 1080) / 2 - 150, data: {} })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={14} /> Diff
              </motion.button>
            </Tooltip>
            <Tooltip content="Add Terminal node" side="bottom">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addNode({ type: "terminal", x: (canvasSettings?.width || 1080) / 2 - 200, y: (canvasSettings?.height || 1080) / 2 - 100, data: {} })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Terminal size={14} /> Terminal
              </motion.button>
            </Tooltip>
            <Tooltip content="Add API node" side="bottom">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addNode({ type: "api", x: (canvasSettings?.width || 1080) / 2 - 250, y: (canvasSettings?.height || 1080) / 2 - 150, data: {} })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Globe size={14} /> API
              </motion.button>
            </Tooltip>
            <Tooltip content="Add Database node" side="bottom">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addNode({ type: "database", x: (canvasSettings?.width || 1080) / 2 - 250, y: (canvasSettings?.height || 1080) / 2 - 150, data: {} })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Database size={14} /> DB
              </motion.button>
            </Tooltip>
            <Tooltip content="Add Profile node" side="bottom">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => addNode({ type: "profile", x: (canvasSettings?.width || 1080) / 2 - 200, y: (canvasSettings?.height || 1080) / 2 - 50, data: {} })}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <UserCircle2 size={14} /> Profile
              </motion.button>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Fit canvas to viewport using the export-frame's parent chain
                const frame = document.getElementById('export-frame');
                const viewport = frame?.closest('section') as HTMLElement | null;
                const vw = viewport?.offsetWidth ?? window.innerWidth;
                const vh = viewport?.offsetHeight ?? window.innerHeight;
                const { width, height } = useCanvasStore.getState().canvasSettings;
                const z = Math.min(vw / width, vh / height) * 0.85;
                useCanvasStore.getState().setZoom(z);
                useCanvasStore.getState().setPan({ x: (vw - width * z) / 2, y: (vh - height * z) / 2 });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 px-3 py-2 rounded-lg transition-colors"
              title="Fit canvas to viewport (F)"
            >
              <Maximize2 size={15} /> Fit
            </motion.button>
            <div className="h-5 w-px bg-neutral-800/60 mx-1" />
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (confirm("Are you sure you want to clear the entire canvas?")) {
                  useCanvasStore.setState({ nodes: [], selectedNodeId: null });
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-red-400 hover:bg-neutral-800/60 px-3 py-2 rounded-lg transition-colors"
              title="Clear all nodes from canvas"
            >
              <Trash2 size={15} />
            </motion.button>
          </div>
          
          {/* Export dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportMenu(v => !v)}
              disabled={isExporting}
              className="flex items-center gap-2 text-sm font-semibold text-black bg-white hover:bg-neutral-200 disabled:opacity-50 px-5 py-2 rounded-lg transition-colors shadow-sm border border-neutral-200"
            >
              <Download size={15} />
              {isExporting ? 'Exporting…' : 'Export'}
              <span className="ml-1 opacity-70 text-[10px]">▼</span>
            </motion.button>

            <AnimatePresence>
              {showExportMenu && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-9 z-50 w-44 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden"
                  >
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 pt-2.5 pb-1">Raster</p>
                    {([
                      { label: 'PNG (1×)', fmt: 'png-1x' },
                      { label: 'PNG (2×)', fmt: 'png-2x' },
                      { label: 'JPEG', fmt: 'jpeg' },
                    ] as const).map(({ label, fmt }) => (
                      <button key={fmt} onClick={() => handleExport(fmt)}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-neutral-800 my-1" />
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-3 pt-1 pb-1">Vector / Doc</p>
                    {([
                      { label: 'SVG', fmt: 'svg' },
                      { label: 'PDF', fmt: 'pdf' },
                    ] as const).map(({ label, fmt }) => (
                      <button key={fmt} onClick={() => handleExport(fmt)}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                        {label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <section className="flex-1 flex flex-col relative">
          <CanvasWorkspace />

          {/* Floating Zoom Controls (Bottom Right) */}
          <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/80 p-1.5 rounded-xl shadow-lg z-40">
            <Tooltip content="Zoom In" side="top">
              <button 
                onClick={() => useCanvasStore.getState().setZoom(z => z + 0.1)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ZoomIn size={16} />
              </button>
            </Tooltip>
            <span className="text-xs font-mono font-medium text-neutral-500 w-12 text-center select-none">
              {Math.round((useCanvasStore.getState().zoom || 1) * 100)}%
            </span>
            <Tooltip content="Zoom Out" side="top">
              <button 
                onClick={() => useCanvasStore.getState().setZoom(z => z - 0.1)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ZoomOut size={16} />
              </button>
            </Tooltip>
            <div className="w-px h-5 bg-neutral-800 mx-1" />
            <Tooltip content="Reset to 100%" side="top">
              <button 
                onClick={() => useCanvasStore.getState().setZoom(1)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Focus size={16} />
              </button>
            </Tooltip>
            <Tooltip content="Fit to Screen (F)" side="top">
              <button 
                onClick={() => {
                  const frame = document.getElementById('export-frame');
                  const viewport = frame?.closest('section') as HTMLElement | null;
                  const vw = viewport?.offsetWidth ?? window.innerWidth;
                  const vh = viewport?.offsetHeight ?? window.innerHeight;
                  const { width, height } = useCanvasStore.getState().canvasSettings;
                  const z = Math.min(vw / width, vh / height) * 0.85;
                  useCanvasStore.getState().setZoom(z);
                  useCanvasStore.getState().setPan({ x: (vw - width * z) / 2, y: (vh - height * z) / 2 });
                }}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Maximize2 size={16} />
              </button>
            </Tooltip>
          </div>

          {/* Keyboard Shortcuts Helper (Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-40">
            <Tooltip content="Keyboard Shortcuts" side="top">
              <button 
                onClick={() => setShowShortcuts(true)}
                className="flex items-center justify-center w-10 h-10 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full shadow-lg transition-colors"
              >
                <Keyboard size={18} />
              </button>
            </Tooltip>
          </div>

          {/* Shortcuts Modal */}
          <AnimatePresence>
            {showShortcuts && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute bottom-20 left-6 w-72 bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
                  <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
                  <button onClick={() => setShowShortcuts(false)} className="text-neutral-500 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Pan Canvas</span>
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300 text-xs font-mono">Scroll</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Zoom In/Out</span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300 text-xs font-mono">Ctrl</kbd>
                      <span className="text-neutral-500">+</span>
                      <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300 text-xs font-mono">Scroll</kbd>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Fit to Screen</span>
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300 text-xs font-mono">F</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Delete Node</span>
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-300 text-xs font-mono">Del / Backspace</kbd>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Sidebar - Properties Panel */}
        <motion.aside 
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="border-l border-neutral-800/50 bg-neutral-900/40 backdrop-blur-md flex flex-col overflow-y-auto z-40 shadow-2xl shrink-0 relative"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Resize Handle */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-500/50 z-50 transition-colors group"
            onPointerDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = sidebarWidth;

              const onPointerMove = (moveEvent: PointerEvent) => {
                const newWidth = Math.max(260, Math.min(800, startWidth - (moveEvent.clientX - startX)));
                setSidebarWidth(newWidth);
              };

              const onPointerUp = () => {
                document.removeEventListener('pointermove', onPointerMove);
                document.removeEventListener('pointerup', onPointerUp);
              };

              document.addEventListener('pointermove', onPointerMove);
              document.addEventListener('pointerup', onPointerUp);
            }}
          />

          <div className="px-5 py-4 border-b border-neutral-800/50 sticky top-0 z-10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-100 tracking-wide">
                {selectedNode ? 'Node Properties' : 'Canvas Settings'}
              </h2>
              {selectedNode && (
                <p className="text-[10px] text-neutral-500 font-mono mt-1">ID: {selectedNode.id.split('-')[0]}</p>
              )}
            </div>
            {selectedNode && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const maxZ = Math.max(...useCanvasStore.getState().nodes.map(n => n.zIndex), 0);
                    useCanvasStore.getState().updateNode(selectedNode.id, { zIndex: maxZ + 1 });
                  }}
                  className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
                  title="Bring to Front"
                >
                  <ArrowUpToLine size={14} />
                </button>
                <button
                  onClick={() => useCanvasStore.getState().updateNode(selectedNode.id, { zIndex: selectedNode.zIndex + 1 })}
                  className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
                  title="Bring Forward"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => useCanvasStore.getState().updateNode(selectedNode.id, { zIndex: selectedNode.zIndex - 1 })}
                  className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
                  title="Send Backward"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => {
                    const minZ = Math.min(...useCanvasStore.getState().nodes.map(n => n.zIndex), 0);
                    useCanvasStore.getState().updateNode(selectedNode.id, { zIndex: minZ - 1 });
                  }}
                  className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
                  title="Send to Back"
                >
                  <ArrowDownToLine size={14} />
                </button>
                <div className="w-px h-4 bg-neutral-800 mx-1" />
                <button
                  onClick={() => useCanvasStore.getState().duplicateNode(selectedNode.id)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors"
                  title="Duplicate Node (Ctrl+D)"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => useCanvasStore.getState().removeNode(selectedNode.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800/60 rounded-md transition-colors"
                  title="Delete Node (Del)"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode ? selectedNode.id : "canvas-settings"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {selectedNode ? (
                  <>
                    {selectedNode.type === "code" && <CodeSettingsPanel />}
                    {selectedNode.type === "diff" && <DiffSettingsPanel />}
                    {selectedNode.type === "terminal" && <TerminalSettingsPanel />}
                    {selectedNode.type === "text" && <TextSettingsPanel />}
                    {selectedNode.type === "api" && <APISettingsPanel />}
                    {selectedNode.type === "database" && <DatabaseSettingsPanel />}
                    {selectedNode.type === "profile" && <ProfileSettingsPanel />}
                  </>
                ) : (
                  <CanvasSettingsPanel />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
