import type { AppState } from "../../types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export default function SettingsPanel({ state, updateState }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Card Content</h2>
        <p className="text-sm text-neutral-400">Configure the content of your diff card.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fileName">File Name</Label>
          <Input 
            id="fileName" 
            value={state.fileName} 
            onChange={(e) => updateState({ fileName: e.target.value })} 
            className="bg-neutral-950 border-neutral-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commitTitle">Commit Title</Label>
          <Input 
            id="commitTitle" 
            value={state.commitTitle} 
            onChange={(e) => updateState({ commitTitle: e.target.value })} 
            className="bg-neutral-950 border-neutral-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input 
            id="description" 
            value={state.description} 
            onChange={(e) => updateState({ description: e.target.value })} 
            className="bg-neutral-950 border-neutral-800"
          />
        </div>
      </div>

      <Separator className="bg-neutral-800" />

      <div>
        <h2 className="text-lg font-bold text-white">Author Details</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Name</Label>
            <Input id="author" value={state.author} onChange={(e) => updateState({ author: e.target.value })} className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">Username</Label>
            <Input id="github" value={state.github} onChange={(e) => updateState({ github: e.target.value })} className="bg-neutral-950 border-neutral-800" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={state.company} onChange={(e) => updateState({ company: e.target.value })} className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" value={state.date} onChange={(e) => updateState({ date: e.target.value })} className="bg-neutral-950 border-neutral-800" />
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-800" />

      <div>
        <h2 className="text-lg font-bold text-white">Appearance & Export</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Resolution</Label>
          <Select value={state.resolution} onValueChange={(val: any) => updateState({ resolution: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080x1080">Instagram (1080x1080)</SelectItem>
              <SelectItem value="1200x627">LinkedIn/Twitter (1200x627)</SelectItem>
              <SelectItem value="1600x900">HD Wide (1600x900)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={state.theme} onValueChange={(val: any) => updateState({ theme: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark Theme</SelectItem>
              <SelectItem value="light">Light Theme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showFooter">Show Footer</Label>
          <Switch id="showFooter" checked={state.showFooter} onCheckedChange={(c) => updateState({ showFooter: c })} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="watermark">Show Watermark</Label>
          <Switch id="watermark" checked={state.watermark} onCheckedChange={(c) => updateState({ watermark: c })} />
        </div>
      </div>

      <Separator className="bg-neutral-800" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">QR / Snapcode</h2>
          <Switch checked={state.qrEnabled} onCheckedChange={(c) => updateState({ qrEnabled: c })} />
        </div>
        
        {state.qrEnabled && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <Label>Code Type</Label>
              <Select value={state.qrType} onValueChange={(val: any) => updateState({ qrType: val })}>
                <SelectTrigger className="bg-neutral-950 border-neutral-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn QR Code</SelectItem>
                  <SelectItem value="snapchat">Snapchat Snapcode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {state.qrType === 'linkedin' ? (
              <div className="space-y-2">
                <Label htmlFor="qrUrl">URL</Label>
                <Input id="qrUrl" value={state.qrUrl} onChange={(e) => updateState({ qrUrl: e.target.value })} className="bg-neutral-950 border-neutral-800" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="snapcode">Upload Snapcode</Label>
                <Input 
                  id="snapcode" 
                  type="file" 
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => updateState({ snapcodeImage: e.target?.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} 
                  className="bg-neutral-950 border-neutral-800 text-neutral-400 file:bg-neutral-900 file:text-neutral-100 file:border-0"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Size</Label>
                  <span className="text-xs text-neutral-500">{state.qrSize}px</span>
                </div>
                <Slider 
                  value={[state.qrSize]} 
                  onValueChange={(val: any) => updateState({ qrSize: val[0] ?? val })}  
                  min={60} 
                  max={300} 
                  step={1} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Border Radius</Label>
                  <span className="text-xs text-neutral-500">{state.qrBorderRadius}px</span>
                </div>
                <Slider 
                  value={[state.qrBorderRadius]} 
                  onValueChange={(val: any) => updateState({ qrBorderRadius: val[0] ?? val })}  
                  min={0} 
                  max={state.qrSize / 2} 
                  step={1} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
