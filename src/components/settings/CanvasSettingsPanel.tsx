import { useCanvasStore } from "../../stores/useCanvasStore";
import type { CanvasSettings } from "../../stores/useCanvasStore";

const GRADIENTS = [
  "from-orange-400 to-rose-400",
  "from-blue-400 to-emerald-400",
  "from-red-200 to-yellow-200",
  "from-green-400 to-emerald-600",
  "from-red-400 to-orange-600",
  "from-amber-200 to-orange-400",
];

const PRESETS = [
  { label: "1080x1080 (Square)", width: 1080, height: 1080 },
  { label: "1200x627 (Twitter/X)", width: 1200, height: 627 },
  { label: "1600x900 (HD)", width: 1600, height: 900 },
];

export default function CanvasSettingsPanel() {
  const { canvasSettings, updateCanvasSettings } = useCanvasStore();

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Canvas Size</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-neutral-500 mb-1 block">Width</label>
            <input
              type="number"
              value={canvasSettings.width}
              onChange={(e) => updateCanvasSettings({ width: Number(e.target.value) })}
              className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-md px-3 py-1.5 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 mb-1 block">Height</label>
            <input
              type="number"
              value={canvasSettings.height}
              onChange={(e) => updateCanvasSettings({ height: Number(e.target.value) })}
              className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-md px-3 py-1.5 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => updateCanvasSettings({ width: p.width, height: p.height })}
              className="text-[10.5px] font-semibold px-2.5 py-1.5 rounded-md bg-neutral-800/80 border border-neutral-700/50 hover:bg-neutral-700 hover:text-white text-neutral-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Canvas Settings</h3>
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-neutral-500 block">Snap to Grid (20px)</label>
          <input
            type="checkbox"
            checked={canvasSettings.snapToGrid}
            onChange={(e) => updateCanvasSettings({ snapToGrid: e.target.checked })}
            className="rounded bg-neutral-900 border-neutral-800 text-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Background Style */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Background</h3>
        <div className="flex flex-col gap-2">
          <select
            value={canvasSettings.backgroundStyle}
            onChange={(e) => updateCanvasSettings({ backgroundStyle: e.target.value as CanvasSettings['backgroundStyle'] })}
            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-md px-3 py-1.5 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="gradient">Gradient (Presets)</option>
            <option value="custom-gradient">Custom Gradient</option>
            <option value="solid">Solid Dark</option>
            <option value="glass">Glassmorphism</option>
            <option value="transparent">Transparent</option>
          </select>
        </div>

        {canvasSettings.backgroundStyle === 'custom-gradient' && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label className="text-[10px] text-neutral-500 mb-1 block">Start Color</label>
              <input
                type="color"
                value={canvasSettings.customGradientStart}
                onChange={(e) => updateCanvasSettings({ customGradientStart: e.target.value })}
                className="w-full h-8 rounded-md cursor-pointer border-0 p-0"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 mb-1 block">End Color</label>
              <input
                type="color"
                value={canvasSettings.customGradientEnd}
                onChange={(e) => updateCanvasSettings({ customGradientEnd: e.target.value })}
                className="w-full h-8 rounded-md cursor-pointer border-0 p-0"
              />
            </div>
          </div>
        )}

        {canvasSettings.backgroundStyle === 'gradient' && (
          <div className="grid grid-cols-6 gap-2 mt-3">
            {GRADIENTS.map((grad) => (
              <button
                key={grad}
                onClick={() => updateCanvasSettings({ backgroundColor: grad })}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} ${
                  canvasSettings.backgroundColor === grad ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-950' : 'opacity-80 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
