import { forwardRef } from "react";
import { useDatabaseStore } from "../../stores/useDatabaseStore";
import type { CanvasNode } from "../../types/canvas";
import { Database } from "lucide-react";

interface Props {
  node?: CanvasNode;
}

const DatabasePreviewCard = forwardRef<HTMLDivElement, Props>(({ node }, ref) => {
  const state = useDatabaseStore();

  const parseSchema = (schema: string) => {
    return schema.split('\n').filter(line => line.trim() !== '').map(line => {
      const parts = line.trim().split(' ');
      const name = parts[0]?.replace(',', '');
      const type = parts[1]?.replace(',', '');
      const extras = parts.slice(2).join(' ')?.replace(',', '');
      return { name, type, extras };
    });
  };

  const fields = parseSchema(state.schema);

  return (
    <div
      ref={ref}
      className="relative transition-all duration-300 w-full h-full"
      style={{
        width: node?.width ? `${node.width}px` : `500px`,
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
        
        {/* Database Header */}
        <div className="flex shrink-0 items-center gap-3 bg-[#161616] border-b border-white/5 px-6 py-4">
          <Database className="text-indigo-400 w-5 h-5" />
          <span className="font-bold font-mono text-neutral-200 text-lg">
            {state.tableName}
          </span>
        </div>

        {/* Schema Table */}
        <div className="flex-1 min-h-0 overflow-auto bg-[#1e1e1e] p-6" style={{ fontSize: state.fontSize }}>
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="text-neutral-500 border-b border-white/10">
                <th className="pb-2 font-semibold">Field</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Attributes</th>
              </tr>
            </thead>
            <tbody className="text-neutral-300">
              {fields.map((f, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 font-bold text-indigo-300 pr-4">{f.name}</td>
                  <td className="py-3 text-emerald-400 pr-4">{f.type}</td>
                  <td className="py-3 text-neutral-500 text-sm">{f.extras}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

DatabasePreviewCard.displayName = "DatabasePreviewCard";

export default DatabasePreviewCard;
