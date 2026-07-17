import type { AppState } from "../../types";
import Editor from "@monaco-editor/react";

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export default function EditorPanel({ state, updateState }: Props) {
  return (
    <div className="flex h-full border-t border-neutral-800">
      <div className="flex-1 flex flex-col border-r border-neutral-800">
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs font-bold tracking-wider text-neutral-400 uppercase">
          Before
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language="typescript"
            theme="vs-dark"
            value={state.beforeCode}
            onChange={(val) => updateState({ beforeCode: val || "" })}
            options={{
              minimap: { enabled: false },
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs font-bold tracking-wider text-neutral-400 uppercase">
          After
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language="typescript"
            theme="vs-dark"
            value={state.afterCode}
            onChange={(val) => updateState({ afterCode: val || "" })}
            options={{
              minimap: { enabled: false },
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>
      </div>
    </div>
  );
}
