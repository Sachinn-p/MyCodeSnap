import { useDatabaseStore } from "../../stores/useDatabaseStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export default function DatabaseSettingsPanel() {
  const state = useDatabaseStore();
  const updateState = state.updateState;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Table Details</h3>
        
        <div className="space-y-2">
          <Label>Table Name</Label>
          <Input 
            value={state.tableName} 
            onChange={(e) => updateState({ tableName: e.target.value })}
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Schema Definition</h3>
        <p className="text-[10px] text-neutral-500">Format: FieldName Type Extras (one per line)</p>
        <textarea 
          value={state.schema}
          onChange={(e) => updateState({ schema: e.target.value })}
          className="w-full font-mono text-xs p-3 h-40 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-4 border-t border-neutral-800 pt-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Appearance</h3>
        
        <div className="space-y-2">
          <Label>Window Style</Label>
          <Select value={state.windowStyle} onValueChange={(val: any) => updateState({ windowStyle: val })}>
            <SelectTrigger>
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

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Font Size</Label>
            <span className="text-xs text-neutral-500">{state.fontSize}px</span>
          </div>
          <Slider 
            value={[state.fontSize]} 
            onValueChange={(val: any) => updateState({ fontSize: val[0] ?? val })} 
            min={10} max={32} step={1} 
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Drop Shadow</Label>
          <Switch checked={state.dropShadow} onCheckedChange={(c) => updateState({ dropShadow: c })} />
        </div>
      </div>
    </div>
  );
}
