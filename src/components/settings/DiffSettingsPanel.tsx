import { useCanvasStore } from "../../stores/useCanvasStore";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import DiffEditorPanel from "../editor/DiffEditorPanel";

export default function DiffSettingsPanel() {
  const { nodes, selectedNodeId, updateNode } = useCanvasStore();
  const node = nodes.find(n => n.id === selectedNodeId);

  if (!node || node.type !== "diff") return null;

  const data = node.data;
  
  // Set defaults if undefined
  const language = data.language || "typescript";
  const windowStyle = data.windowStyle || "mac";
  const theme = data.theme || "github-light";
  const renderSideBySide = data.renderSideBySide ?? false;
  const borderRadius = data.borderRadius ?? 12;
  const dropShadow = data.dropShadow ?? true;

  const updateData = (updates: any) => {
    updateNode(node.id, { data: { ...data, ...updates } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Diff Node</h2>
        <p className="text-sm text-neutral-400">Configure the diff visualization.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <DiffEditorPanel />
      </motion.div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={language} onValueChange={(val) => updateData({ language: val })}>
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
          <Label>Theme</Label>
          <Select value={theme} onValueChange={(val) => updateData({ theme: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="github-light">GitHub Light</SelectItem>
              <SelectItem value="github-dark">GitHub Dark</SelectItem>
              <SelectItem value="vs-dark">VS Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Window Style</Label>
          <Select value={windowStyle} onValueChange={(val) => updateData({ windowStyle: val })}>
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
        <div className="flex items-center justify-between">
          <Label>Side-by-Side View</Label>
          <Switch checked={renderSideBySide} onCheckedChange={(c) => updateData({ renderSideBySide: c })} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Font Size</Label>
            <span className="text-xs text-neutral-500">{data.fontSize || 16}px</span>
          </div>
          <Slider 
            value={[data.fontSize || 16]} 
            onValueChange={(val: any) => updateData({ fontSize: val[0] ?? val })} 
            min={10} 
            max={48} 
            step={1} 
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Border Radius</Label>
            <span className="text-xs text-neutral-500">{borderRadius}px</span>
          </div>
          <Slider 
            value={[borderRadius]} 
            onValueChange={(val) => updateData({ borderRadius: val[0] ?? val })} 
            min={0} 
            max={32} 
            step={2} 
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Drop Shadow</Label>
          <Switch checked={dropShadow} onCheckedChange={(c) => updateData({ dropShadow: c })} />
        </div>
      </div>
    </div>
  );
}
