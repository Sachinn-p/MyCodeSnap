import { forwardRef, useRef } from "react";
import type { AppState } from "../../types";
import DiffRenderer from "./DiffRenderer";
import DraggableCode from "./DraggableCode";
import { GitBranch as GithubIcon, Globe, Briefcase } from "lucide-react";

interface Props {
  state: AppState;
}

const PreviewCard = forwardRef<HTMLDivElement, Props>(({ state }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse resolution
  let width = 1200;
  let height = 627;
  
  if (state.resolution === "1080x1080") {
    width = 1080;
    height = 1080;
  } else if (state.resolution === "1600x900") {
    width = 1600;
    height = 900;
  } else if (state.resolution === "custom") {
    width = state.customWidth;
    height = state.customHeight;
  }

  const isDark = state.theme === "dark";

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all ${isDark ? 'bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]' : 'bg-gradient-to-br from-[#f6f8fa] via-[#ffffff] to-[#f6f8fa]'}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(128,128,128,0.2) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col p-12 lg:p-16" ref={containerRef}>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-4xl font-extrabold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {state.commitTitle}
            </h1>
            {state.description && (
              <p className={`text-xl font-semibold max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {state.description}
              </p>
            )}
          </div>
          
          <div className={`flex flex-col items-end gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="text-lg font-bold">{state.date}</span>
          </div>
        </div>

        {/* Diff Renderer */}
        <div className="flex-1 overflow-hidden flex flex-col justify-center max-h-[80%]">
          <DiffRenderer state={state} />
        </div>
      </div>

      {/* Draggable QR/Snapcode Overlay */}
      <DraggableCode state={state} boundsRef={containerRef} />

      {/* Footer Section */}
      {state.showFooter && (
        <div className={`relative z-10 px-12 py-6 border-t flex justify-between items-center ${isDark ? 'bg-[#161b22]/80 border-[#30363d] backdrop-blur-md' : 'bg-white/80 border-neutral-200 backdrop-blur-md'}`}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {state.author.charAt(0)}
              </div>
              <div>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{state.author}</p>
                {state.company && (
                  <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Briefcase className="w-3 h-3" /> {state.company}
                  </p>
                )}
              </div>
            </div>
            
            <div className="h-8 w-px bg-slate-500/20 mx-2" />
            
            <div className={`flex gap-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {state.github && (
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4" />
                  <span className="font-semibold">{state.github}</span>
                </div>
              )}
            </div>
          </div>

          {state.watermark && (
            <div className={`flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Globe className="w-4 h-4" />
              <span>Built by Sachinn</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

PreviewCard.displayName = "PreviewCard";

export default PreviewCard;
