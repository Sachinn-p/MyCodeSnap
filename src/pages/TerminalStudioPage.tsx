import { useRef } from "react";
import TerminalSettingsPanel from "../components/settings/TerminalSettingsPanel";
import TerminalPreviewCard from "../components/preview/TerminalPreviewCard";
import ExportManager from "../components/ExportManager";

export default function TerminalStudioPage() {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950">
      <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-bold text-neutral-100">Terminal Snapshot Studio</h1>
          <p className="text-xs text-neutral-500">Generate beautiful terminal screenshots</p>
        </div>
        <div className="flex items-center gap-4">
          <ExportManager previewRef={previewRef} fileName="terminal-snapshot" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-1/3 min-w-[400px] border-r border-neutral-800 bg-neutral-900/30 flex flex-col overflow-y-auto">
          <div className="p-6 space-y-8">
            <TerminalSettingsPanel />
          </div>
        </aside>

        {/* Center - Preview */}
        <section className="flex-1 flex flex-col relative overflow-hidden">
          <div className="flex-1 overflow-auto flex items-center justify-center p-8 relative bg-[#0a0a0a]">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent pointer-events-none"></div>
            <div className="relative transform-gpu transition-transform">
              <TerminalPreviewCard ref={previewRef} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
