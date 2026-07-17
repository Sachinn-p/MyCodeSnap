import { forwardRef } from "react";
import { useProfileStore } from "../../stores/useProfileStore";
import type { CanvasNode } from "../../types/canvas";

interface Props {
  node?: CanvasNode;
}

const ProfilePreviewCard = forwardRef<HTMLDivElement, Props>(({ node }, ref) => {
  const state = useProfileStore();

  return (
    <div
      ref={ref}
      className="relative transition-all duration-300 w-full h-full"
      style={{
        width: node?.width ? `${node.width}px` : `400px`,
        height: node?.height ? `${node.height}px` : undefined,
      }}
    >
      <div 
        data-drag-handle
        className={`w-full h-full overflow-hidden flex flex-col shadow-2xl cursor-grab active:cursor-grabbing ${
          state.glassmorphism 
            ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
            : state.theme === 'dark' 
              ? 'bg-[#1e1e1e] border border-white/10' 
              : 'bg-white border border-neutral-200'
        }`}
        style={{ borderRadius: state.borderRadius }}
      >
        <div className="flex items-center p-6 gap-5 h-full">
          {/* Avatar */}
          <div className="shrink-0 relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 bg-neutral-800" style={{ borderColor: state.avatarBorderColor || '#6366f1' }}>
              {state.avatarUrl ? (
                <img 
                  src={state.avatarUrl.startsWith('http') && !state.avatarUrl.includes('wsrv.nl') 
                    ? `https://wsrv.nl/?url=${encodeURIComponent(state.avatarUrl)}&w=256&h=256&fit=cover` 
                    : state.avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                  draggable={false} 
                  crossOrigin="anonymous" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-indigo-500/20" />
              )}
            </div>
            {/* Online Indicator / Decorator */}
            {state.showOnlineIndicator !== false && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 rounded-full" style={{ borderColor: state.theme === 'dark' || state.glassmorphism ? '#1e1e1e' : '#ffffff' }} />
            )}
          </div>
          
          {/* Details */}
          <div className="flex-1 flex flex-col justify-center min-w-0" style={{ fontSize: state.fontSize }}>
            <h2 className={`font-bold text-[1.25em] truncate ${state.glassmorphism || state.theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
              {state.name}
            </h2>
            <p className={`text-[0.875em] truncate font-semibold mt-0.5 ${state.glassmorphism ? 'text-white/80' : state.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {state.role}
            </p>
            
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="bg-[#0A66C2] p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <span className={`text-[0.75em] font-bold tracking-wide ${state.glassmorphism ? 'text-indigo-200' : state.theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {state.handle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfilePreviewCard.displayName = "ProfilePreviewCard";

export default ProfilePreviewCard;
