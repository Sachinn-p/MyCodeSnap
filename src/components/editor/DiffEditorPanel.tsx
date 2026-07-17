import { useCanvasStore } from "../../stores/useCanvasStore";
import Editor from "@monaco-editor/react";

export default function DiffEditorPanel() {
  const { nodes, selectedNodeId, updateNode } = useCanvasStore();
  const node = nodes.find(n => n.id === selectedNodeId);

  if (!node || node.type !== "diff") return null;

  const data = node.data;

  const handleOriginalChange = (value: string | undefined) => {
    updateNode(node.id, { data: { ...data, originalCode: value || "" } });
  };

  const handleModifiedChange = (value: string | undefined) => {
    updateNode(node.id, { data: { ...data, modifiedCode: value || "" } });
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-2">
      <div className="h-[200px] flex flex-col border border-neutral-800 rounded-lg overflow-hidden bg-[#1e1e1e]">
        <div className="px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[10px] font-bold tracking-wider text-neutral-400 uppercase flex justify-between items-center">
          <span>Original Code (Before)</span>
        </div>
        <div className="flex-1">
          <Editor
            language={data.language || "typescript"}
            theme="vs-dark"
            value={data.originalCode || ""}
            onChange={handleOriginalChange}
            options={{
              minimap: { enabled: false },
              padding: { top: 16 },
              fontSize: 14,
            }}
          />
        </div>
      </div>
      <div className="h-[200px] flex flex-col border border-neutral-800 rounded-lg overflow-hidden bg-[#1e1e1e]">
        <div className="px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[10px] font-bold tracking-wider text-neutral-400 uppercase flex justify-between items-center">
          <span>Modified Code (After)</span>
        </div>
        <div className="flex-1">
          <Editor
            language={data.language || "typescript"}
            theme="vs-dark"
            value={data.modifiedCode || ""}
            onChange={handleModifiedChange}
            options={{
              minimap: { enabled: false },
              padding: { top: 16 },
              fontSize: 14,
            }}
          />
        </div>
      </div>
    </div>
  );
}
