import { useCodeStore } from "../../stores/useCodeStore";
import Editor from "@monaco-editor/react";

export default function CodeEditorPanel() {
  const state = useCodeStore();

  return (
    <div className="flex h-[280px] border border-neutral-800 rounded-lg overflow-hidden bg-[#1e1e1e] mt-2">
      <div className="flex-1 flex flex-col">
        <div className="px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[10px] font-bold tracking-wider text-neutral-400 uppercase flex justify-between items-center">
          <span>Source Code</span>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language={state.language}
            theme={state.theme === "vs-dark" ? "vs-dark" : "light"}
            value={state.code}
            onChange={(val) => state.updateState({ code: val || "" })}
            options={{
              minimap: { enabled: false },
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: state.fontFamily,
              fontLigatures: state.fontLigatures,
            }}
          />
        </div>
      </div>
    </div>
  );
}
