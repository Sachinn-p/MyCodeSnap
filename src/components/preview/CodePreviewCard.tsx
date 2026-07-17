import { forwardRef, useEffect, useState } from "react";
import { useCodeStore } from "../../stores/useCodeStore";
import Editor from "@monaco-editor/react";
import type { CanvasNode } from "../../types/canvas";

interface Props {
  node?: CanvasNode;
}

const CodePreviewCard = forwardRef<HTMLDivElement, Props>(({ node }, ref) => {
  const state = useCodeStore();
  const [editorHeight, setEditorHeight] = useState(200);

  // Calculate approximate height based on lines
  useEffect(() => {
    const lines = state.code.split('\n').length;
    const lineHeight = Math.ceil(state.fontSize * 1.5);
    setEditorHeight(Math.max(200, lines * lineHeight + 40));
  }, [state.code, state.fontSize]);

  return (
    <div
      ref={ref}
      className="relative transition-all duration-300 w-full h-full"
      style={{
        width: node?.width ? `${node.width}px` : `${state.customWidth || 600}px`,
        height: node?.height ? `${node.height}px` : undefined,
        filter: state.dropShadow ? 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' : 'none',
      }}
    >
      <div 
        className="w-full h-full bg-[#1e1e1e] border border-white/10 overflow-hidden flex flex-col shadow-2xl"
        style={{ borderRadius: state.borderRadius }}
      >
        {/* Window Controls */}
        {state.windowStyle !== 'none' && (
          <div 
            data-drag-handle
            className={`h-12 shrink-0 px-4 flex items-center bg-[#1e1e1e] border-b border-white/5 cursor-grab active:cursor-grabbing ${state.windowStyle === 'windows' ? 'justify-end' : 'justify-start'}`}
          >
            {state.windowStyle === 'mac' && (
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
            )}
            {state.windowStyle === 'linux' && (
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
              </div>
            )}
            {state.windowStyle === 'windows' && (
              <div className="flex gap-4 items-center">
                <div className="w-3 h-[1px] bg-neutral-400" />
                <div className="w-3 h-3 border border-neutral-400" />
                <div className="w-3 h-3 relative before:absolute before:inset-0 before:bg-neutral-400 before:w-full before:h-[1px] before:rotate-45 before:top-1/2 after:absolute after:inset-0 after:bg-neutral-400 after:w-full after:h-[1px] after:-rotate-45 after:top-1/2" />
              </div>
            )}
          </div>
        )}
        
        {/* ReadOnly Monaco Editor */}
        <div style={node?.height ? undefined : { height: editorHeight, minHeight: editorHeight }} className="w-full flex-1 min-h-0 bg-[#1e1e1e] relative overflow-hidden">
          <div className="absolute inset-0 py-4">
            <Editor
              language={state.language}
              theme="vs-dark"
              value={state.code}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: state.fontSize,
                fontFamily: state.fontFamily,
                fontLigatures: state.fontLigatures,
                lineNumbers: state.lineNumbers ? "on" : "off",
                wordWrap: "on",
                renderLineHighlight: "none",
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                scrollbar: { vertical: "hidden", horizontal: "hidden" }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

CodePreviewCard.displayName = "CodePreviewCard";

export default CodePreviewCard;
