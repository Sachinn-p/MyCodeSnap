import { useCodeStore } from "../../stores/useCodeStore";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import CodeEditorPanel from "../editor/CodeEditorPanel";

export default function CodeSettingsPanel() {
  const state = useCodeStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Code Node</h2>
        <p className="text-sm text-neutral-400">Configure the code block aesthetics.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <CodeEditorPanel />
      </motion.div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={state.language} onValueChange={(val: any) => state.updateState({ language: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="dockerfile">Dockerfile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Window Style</Label>
          <Select value={state.windowStyle} onValueChange={(val: any) => state.updateState({ windowStyle: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mac">macOS</SelectItem>
              <SelectItem value="windows">Windows</SelectItem>
              <SelectItem value="linux">Linux</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-neutral-800" />

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Font Size</Label>
            <span className="text-xs text-neutral-500">{state.fontSize}px</span>
          </div>
          <Slider 
            value={[state.fontSize]} 
            onValueChange={(val: any) => state.updateState({ fontSize: val[0] ?? val })} 
            min={10} 
            max={48} 
            step={1} 
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Border Radius</Label>
            <span className="text-xs text-neutral-500">{state.borderRadius}px</span>
          </div>
          <Slider 
            value={[state.borderRadius]} 
            onValueChange={(val: any) => state.updateState({ borderRadius: val[0] ?? val })} 
            min={0} 
            max={32} 
            step={2} 
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Node Width</Label>
            <span className="text-xs text-neutral-500">{state.customWidth}px</span>
          </div>
          <Slider 
            value={[state.customWidth || 600]} 
            onValueChange={(val: any) => state.updateState({ customWidth: val[0] ?? val })} 
            min={400} 
            max={1600} 
            step={10} 
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Drop Shadow</Label>
          <Switch checked={state.dropShadow} onCheckedChange={(c) => state.updateState({ dropShadow: c })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Line Numbers</Label>
          <Switch checked={state.lineNumbers} onCheckedChange={(c) => state.updateState({ lineNumbers: c })} />
        </div>
      </div>
    </div>
  );
}
