import { useMemo } from "react";
import * as Diff from "diff";
import type { AppState } from "../../types";
import { FileIcon } from "lucide-react";

interface Props {
  state: AppState;
}

export default function DiffRenderer({ state }: Props) {
  const diffs = useMemo(() => {
    return Diff.diffLines(state.beforeCode, state.afterCode);
  }, [state.beforeCode, state.afterCode]);

  const isDark = state.theme === "dark";

  let oldLineNumber = 1;
  let newLineNumber = 1;

  return (
    <div className={`rounded-xl border shadow-2xl overflow-hidden font-mono text-sm leading-6 flex flex-col ${isDark ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-white border-neutral-200 text-[#24292f]'}`}>
      {/* File Header */}
      <div className={`px-4 py-3 flex items-center gap-2 border-b text-xs font-bold ${isDark ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]' : 'bg-[#f6f8fa] border-neutral-200 text-[#57606a]'}`}>
        <FileIcon className="w-4 h-4" />
        {state.fileName}
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-hidden relative group">
        <table className="w-full border-collapse text-left whitespace-pre">
          <colgroup>
            <col className="w-[40px] min-w-[40px]" />
            <col className="w-[40px] min-w-[40px]" />
            <col className="w-[20px]" />
            <col className="w-full" />
          </colgroup>
          <tbody>
            {diffs.map((part, index) => {
              const lines = part.value.replace(/\n$/, "").split("\n");
              return lines.map((line, lineIndex) => {
                const isAdded = part.added;
                const isRemoved = part.removed;
                
                let oldLine = "";
                let newLine = "";

                if (isRemoved) {
                  oldLine = String(oldLineNumber++);
                } else if (isAdded) {
                  newLine = String(newLineNumber++);
                } else {
                  oldLine = String(oldLineNumber++);
                  newLine = String(newLineNumber++);
                }

                // Colors mapping
                let bgClass = "";
                let textClass = "";
                let numBgClass = "";
                let sign = " ";

                if (isDark) {
                  if (isAdded) {
                    bgClass = "bg-[#2ea04326]";
                    numBgClass = "bg-[#2ea04326]";
                    textClass = "text-[#e6ffed]";
                    sign = "+";
                  } else if (isRemoved) {
                    bgClass = "bg-[#f8514926]";
                    numBgClass = "bg-[#f8514926]";
                    textClass = "text-[#ffeef0]";
                    sign = "-";
                  } else {
                    bgClass = "bg-transparent";
                    numBgClass = "bg-transparent";
                    textClass = "text-[#8b949e]";
                  }
                } else {
                  if (isAdded) {
                    bgClass = "bg-[#e6ffec]";
                    numBgClass = "bg-[#ccffd8]";
                    textClass = "text-[#24292f]";
                    sign = "+";
                  } else if (isRemoved) {
                    bgClass = "bg-[#ffebe9]";
                    numBgClass = "bg-[#ffdce0]";
                    textClass = "text-[#24292f]";
                    sign = "-";
                  } else {
                    bgClass = "bg-transparent";
                    numBgClass = "bg-transparent";
                    textClass = "text-[#24292f]";
                  }
                }

                return (
                  <tr key={`${index}-${lineIndex}`} className={bgClass}>
                    <td className={`select-none text-right px-2 ${isDark ? 'text-[#6e7681]' : 'text-[#6e7781]'} ${numBgClass}`}>
                      {oldLine}
                    </td>
                    <td className={`select-none text-right px-2 ${isDark ? 'text-[#6e7681]' : 'text-[#6e7781]'} ${numBgClass}`}>
                      {newLine}
                    </td>
                    <td className={`select-none text-center px-2 w-[20px] ${isDark ? (isAdded ? 'text-[#3fb950]' : isRemoved ? 'text-[#f85149]' : 'text-transparent') : (isAdded ? 'text-[#1a7f37]' : isRemoved ? 'text-[#cf222e]' : 'text-transparent')}`}>
                      {sign}
                    </td>
                    <td className={`pl-2 pr-4 py-[1px] break-all ${textClass}`}>
                      <span className={isDark && !isAdded && !isRemoved ? 'text-[#c9d1d9]' : ''}>{line || " "}</span>
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
