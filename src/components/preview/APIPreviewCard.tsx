import { forwardRef, useEffect, useState } from "react";
import { useApiStore } from "../../stores/useApiStore";
import Editor from "@monaco-editor/react";
import type { CanvasNode } from "../../types/canvas";

interface Props {
  node?: CanvasNode;
}

const APIPreviewCard = forwardRef<HTMLDivElement, Props>(({ node }, ref) => {
  const state = useApiStore();
  const [editorHeight, setEditorHeight] = useState(200);

  useEffect(() => {
    const resLines = state.responseBody.split('\n').length;
    const reqLines = state.requestBody.split('\n').length;
    const lineHeight = Math.ceil(state.fontSize * 1.5);
    
    let totalLines = resLines;
    if (state.apiLayout === 'request-only') totalLines = reqLines;
    else if (state.apiLayout === 'split') totalLines = Math.max(reqLines, resLines);
    else if (state.apiLayout === 'tabs') {
      totalLines = state.activeTab === 'request' ? reqLines : resLines;
      totalLines += 2; // Add space for the tab bar
    }

    setEditorHeight(Math.max(150, totalLines * lineHeight + 20));
  }, [state.responseBody, state.requestBody, state.fontSize, state.apiLayout, state.activeTab]);

  const methodColors: Record<string, string> = {
    GET: "text-blue-400",
    POST: "text-emerald-400",
    PUT: "text-amber-400",
    DELETE: "text-red-400",
    PATCH: "text-cyan-400"
  };

  return (
    <div
      ref={ref}
      className="relative transition-all duration-300 w-full h-full"
      style={{
        width: node?.width ? `${node.width}px` : `600px`,
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
        
        {/* API Details Header */}
        <div className="flex flex-col shrink-0 bg-[#1e1e1e] border-b border-white/5 p-4 gap-3">
          <div className="flex items-center gap-3">
            <span className={`font-bold font-mono text-lg ${methodColors[state.method] || 'text-neutral-300'}`}>
              {state.method}
            </span>
            <span className="text-neutral-300 font-mono text-sm tracking-wide truncate">
              {state.url}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Status:</span>
              <span className={state.statusCode >= 400 ? "text-red-400" : state.statusCode >= 300 ? "text-amber-400" : "text-emerald-400"}>
                {state.statusCode} {state.statusCode === 200 ? 'OK' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Time:</span>
              <span className="text-emerald-400">{state.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Size:</span>
              <span className="text-emerald-400">{state.size}</span>
            </div>
          </div>
        </div>

        {/* Editor Area based on Layout */}
        <div style={node?.height ? undefined : { height: editorHeight, minHeight: editorHeight }} className="w-full flex-1 flex flex-col min-h-0 bg-[#1e1e1e] relative overflow-hidden">
          {state.apiLayout === 'tabs' && (
            <div className="flex border-b border-white/5 bg-[#1e1e1e]">
              <div 
                onClick={() => state.updateState({ activeTab: 'request' })}
                className={`px-4 py-2 text-xs font-mono font-semibold border-b-2 cursor-pointer transition-colors ${state.activeTab === 'request' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
              >
                Request
              </div>
              <div 
                onClick={() => state.updateState({ activeTab: 'response' })}
                className={`px-4 py-2 text-xs font-mono font-semibold border-b-2 cursor-pointer transition-colors ${state.activeTab === 'response' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
              >
                Response
              </div>
            </div>
          )}

          <div className="flex-1 flex w-full relative">
            {state.apiLayout === 'split' ? (
              <div className="flex w-full">
                <div className="flex-1 border-r border-white/5 relative">
                  <div className="absolute top-2 right-4 z-10 text-[10px] font-bold text-neutral-600 bg-[#1e1e1e] px-1">REQ</div>
                  <div className="absolute inset-0 py-2">
                    <Editor
                      language="json"
                      theme="vs-dark"
                      value={state.requestBody}
                      options={{
                        readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false,
                        fontSize: state.fontSize, lineNumbers: "on", wordWrap: "on",
                        renderLineHighlight: "none", hideCursorInOverviewRuler: true,
                        overviewRulerBorder: false, scrollbar: { vertical: "hidden", horizontal: "hidden" }
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute top-2 right-4 z-10 text-[10px] font-bold text-neutral-600 bg-[#1e1e1e] px-1">RES</div>
                  <div className="absolute inset-0 py-2">
                    <Editor
                      language="json"
                      theme="vs-dark"
                      value={state.responseBody}
                      options={{
                        readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false,
                        fontSize: state.fontSize, lineNumbers: "on", wordWrap: "on",
                        renderLineHighlight: "none", hideCursorInOverviewRuler: true,
                        overviewRulerBorder: false, scrollbar: { vertical: "hidden", horizontal: "hidden" }
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 py-2">
                <Editor
                  language="json"
                  theme="vs-dark"
                  value={
                    state.apiLayout === 'request-only' ? state.requestBody :
                    state.apiLayout === 'response-only' ? state.responseBody :
                    state.activeTab === 'request' ? state.requestBody : state.responseBody
                  }
                  options={{
                    readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false,
                    fontSize: state.fontSize, lineNumbers: "on", wordWrap: "on",
                    renderLineHighlight: "none", hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false, scrollbar: { vertical: "hidden", horizontal: "hidden" }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

APIPreviewCard.displayName = "APIPreviewCard";

export default APIPreviewCard;
