import { useProfileStore } from "../../stores/useProfileStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export default function ProfileSettingsPanel() {
  const state = useProfileStore();
  const updateState = state.updateState;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Profile Information</h3>
        
        <div className="space-y-2">
          <Label>Name</Label>
          <Input 
            value={state.name} 
            onChange={(e) => updateState({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Role / Title</Label>
          <Input 
            value={state.role} 
            onChange={(e) => updateState({ role: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>LinkedIn Handle</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">@</span>
            <Input 
              value={state.handle.replace('@', '')} 
              onChange={(e) => updateState({ handle: `@${e.target.value}` })}
              className="pl-7 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Avatar Image</Label>
          <div className="flex gap-2 items-center">
            <Label htmlFor="avatar-upload" className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded font-semibold transition-colors">
              Upload Image
            </Label>
            <input 
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  updateState({ avatarUrl: event.target?.result as string });
                };
                reader.readAsDataURL(file);
              }}
            />
            <span className="text-xs text-neutral-500 flex-1 truncate">
              {state.avatarUrl.startsWith('data:image') ? 'Local image selected' : 'Or paste URL below'}
            </span>
          </div>
          <Input 
            value={state.avatarUrl.startsWith('data:image') ? '' : state.avatarUrl} 
            onChange={(e) => updateState({ avatarUrl: e.target.value })}
            placeholder="https://..."
            className="font-mono text-xs mt-2"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-neutral-800 pt-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Appearance</h3>
        
        <div className="flex items-center justify-between">
          <Label>Online Indicator</Label>
          <Switch checked={state.showOnlineIndicator} onCheckedChange={(c) => updateState({ showOnlineIndicator: c })} />
        </div>

        <div className="space-y-2">
          <Label>Avatar Border Color</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={state.avatarBorderColor || "#6366f1"} 
              onChange={(e) => updateState({ avatarBorderColor: e.target.value })}
              className="w-12 p-1 h-10 bg-neutral-950 border-neutral-800"
            />
            <Input 
              type="text" 
              value={state.avatarBorderColor || "#6366f1"} 
              onChange={(e) => updateState({ avatarBorderColor: e.target.value })}
              className="flex-1 bg-neutral-950 border-neutral-800 uppercase"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Glassmorphism Effect</Label>
          <Switch checked={state.glassmorphism} onCheckedChange={(c) => updateState({ glassmorphism: c })} />
        </div>

        {!state.glassmorphism && (
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={state.theme} onValueChange={(val: any) => updateState({ theme: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Base Font Size</Label>
            <span className="text-xs text-neutral-500">{state.fontSize}px</span>
          </div>
          <Slider 
            value={[state.fontSize]} 
            onValueChange={(val: any) => updateState({ fontSize: val[0] ?? val })} 
            min={12} max={32} step={1} 
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Border Radius</Label>
            <span className="text-xs text-neutral-500">{state.borderRadius}px</span>
          </div>
          <Slider 
            value={[state.borderRadius]} 
            onValueChange={(val: any) => updateState({ borderRadius: val[0] ?? val })} 
            min={0} max={48} step={2} 
          />
        </div>
      </div>
    </div>
  );
}
