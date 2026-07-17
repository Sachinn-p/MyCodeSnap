import { useCanvasStore } from "../../stores/useCanvasStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

export default function TextSettingsPanel() {
  const { nodes, selectedNodeId, updateNode } = useCanvasStore();
  const node = nodes.find((n) => n.id === selectedNodeId);
  const data = node?.data || {};

  if (!node) return null;

  const updateData = (updates: any) => {
    updateNode(node.id, { data: { ...data, ...updates } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Text Appearance</h2>
        <p className="text-sm text-neutral-400">Customize font size, weight, and color. Double-click the text on canvas to edit.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Content</Label>
          <textarea
            value={data.text ?? ""}
            onChange={(e) => updateData({ text: e.target.value })}
            className="w-full min-h-[100px] p-3 text-sm bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
            placeholder="Enter text..."
          />
        </div>

        <div className="space-y-2">
          <Label>Font Size (px)</Label>
          <Input
            type="number"
            value={data.fontSize || 32}
            onChange={(e) => updateData({ fontSize: parseInt(e.target.value) || 32 })}
            className="bg-neutral-950 border-neutral-800"
          />
        </div>

        <div className="space-y-2">
          <Label>Font Weight</Label>
          <Select value={data.fontWeight || "bold"} onValueChange={(val) => updateData({ fontWeight: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="semibold">Semi Bold</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="extrabold">Extra Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Color (Hex/RGB)</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={data.color || "#ffffff"}
              onChange={(e) => updateData({ color: e.target.value })}
              className="w-12 p-1 h-10 bg-neutral-950 border-neutral-800"
            />
            <Input
              type="text"
              value={data.color || "#ffffff"}
              onChange={(e) => updateData({ color: e.target.value })}
              className="flex-1 bg-neutral-950 border-neutral-800 uppercase"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Alignment</Label>
          <div className="flex gap-2 p-1 bg-neutral-950 border border-neutral-800 rounded-md">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                onClick={() => updateData({ textAlign: align })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded capitalize ${data.textAlign === align || (!data.textAlign && align === 'left') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={data.fontFamily || "inherit"} onValueChange={(val) => updateData({ fontFamily: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inherit">Inherit (Default)</SelectItem>
              <SelectItem value="ui-sans-serif, system-ui, sans-serif">Sans Serif</SelectItem>
              <SelectItem value="ui-serif, Georgia, serif">Serif</SelectItem>
              <SelectItem value="ui-monospace, SFMono-Regular, monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-neutral-800" />
    </div>
  );
}
