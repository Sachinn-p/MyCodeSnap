import { forwardRef } from "react";
import { useTerminalStore } from "../../stores/useTerminalStore";
import type { CanvasNode } from "../../types/canvas";

interface Props {
  node?: CanvasNode;
}

const TerminalPreviewCard = forwardRef<HTMLDivElement, Props>(({ node }, ref) => {
  const state = useTerminalStore();
  
  // Parse resolution
  let width = 1080;
  let height = 1080;
  
  if (node?.width) {
    width = node.width;
  } else if (state.resolution === "1080x1080") {
    width = 1080;
    height = 1080;
  } else if (state.resolution === "1200x627") {
    width = 1200;
    height = 627;
  } else if (state.resolution === "1600x900") {
    width = 1600;
    height = 900;
  }
  
  if (node?.height) {
    height = node.height;
  }

  const getThemeStyles = () => {
    switch (state.theme) {
      case "warp":
        return { bg: "bg-[#18181b]", text: "text-[#d4d4d8]", header: "bg-[#27272a]", border: "border-white/10" };
      case "ubuntu":
        return { bg: "bg-[#300a24]", text: "text-white", header: "bg-[#433f3e]", border: "border-transparent" };
      case "windows":
        return { bg: "bg-black", text: "text-gray-300", header: "bg-[#1c1c1c]", border: "border-white/10" };
      case "hyper":
      default:
        return { bg: "bg-[#000000]", text: "text-[#fff]", header: "bg-[#333]", border: "border-white/10" };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      ref={ref}
      className="relative transition-all duration-300 w-full h-full"
      style={{
        width: node?.width ? `${node.width}px` : `${state.customWidth || 800}px`,
        height: node?.height ? `${node.height}px` : undefined,
        filter: state.dropShadow ? 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' : 'none',
      }}
    >
      <div 
        className={`w-full h-full flex flex-col shadow-2xl overflow-hidden border ${themeStyles.border} ${themeStyles.bg}`}
        style={{ borderRadius: state.borderRadius }}
      >
        {/* Header */}
        <div className={`h-12 shrink-0 px-4 flex items-center ${themeStyles.header}`}>
          {state.theme === "ubuntu" && (
            <div className="flex gap-2 justify-start items-center w-full">
              <div className="w-3 h-3 rounded-full bg-[#ef6856]" />
              <div className="w-3 h-3 rounded-full bg-[#f8b248]" />
              <div className="w-3 h-3 rounded-full bg-[#52c140]" />
              <span className="flex-1 text-center text-xs font-bold text-white tracking-wider">sachinn@ubuntu: ~</span>
            </div>
          )}
          {state.theme === "hyper" && (
            <div className="flex gap-2 justify-start">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
          )}
          {state.theme === "warp" && (
            <div className="flex gap-2 justify-start items-center w-full">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <span className="flex-1 text-center text-xs font-semibold text-white/50">Warp</span>
            </div>
          )}
          {state.theme === "windows" && (
            <div className="flex gap-2 justify-end w-full items-center">
              <span className="flex-1 text-xs font-semibold text-white/50 px-2">Windows PowerShell</span>
              <div className="w-3 h-[1px] bg-neutral-400" />
              <div className="w-3 h-3 border border-neutral-400 mx-2" />
              <div className="text-neutral-400 text-xs">✕</div>
            </div>
          )}
        </div>

        {/* Terminal Content */}
        <div className={`flex-1 p-6 font-mono text-sm leading-relaxed overflow-hidden ${themeStyles.text} whitespace-pre-wrap`}>
          {state.commands.map((cmd) => (
            <div key={cmd.id} className="mb-4 last:mb-0">
              <div className="flex gap-2 font-bold">
                <span className={state.theme === "ubuntu" ? "text-[#8ae234]" : "text-indigo-400"}>
                  {cmd.prompt}
                </span>
                <span>{cmd.command}</span>
              </div>
              {cmd.output && (
                <div className="mt-1 opacity-80">
                  {cmd.output}
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-2 font-bold mt-4">
            <span className={state.theme === "ubuntu" ? "text-[#8ae234]" : "text-indigo-400"}>
              ~/mycodesnap $
            </span>
            <span className="w-2 h-4 bg-white/80 animate-pulse inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
});

TerminalPreviewCard.displayName = "TerminalPreviewCard";

export default TerminalPreviewCard;
