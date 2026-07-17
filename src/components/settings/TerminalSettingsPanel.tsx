import { useTerminalStore } from "../../stores/useTerminalStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Plus, Trash2 } from "lucide-react";

export default function TerminalSettingsPanel() {
  const state = useTerminalStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Commands</h2>
        <p className="text-sm text-neutral-400">Add commands to the terminal window.</p>
      </div>

      <div className="space-y-4">
        {state.commands.map((cmd) => (
          <div key={cmd.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3 relative group">
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute -top-3 -right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => state.removeCommand(cmd.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <div className="space-y-1">
              <Label className="text-xs">Prompt</Label>
              <Input 
                value={cmd.prompt} 
                onChange={(e: any) => state.updateCommand(cmd.id, { prompt: e.target.value })}
                className="h-8 bg-neutral-950 border-neutral-800"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Command</Label>
              <Input 
                value={cmd.command} 
                onChange={(e: any) => state.updateCommand(cmd.id, { command: e.target.value })}
                className="h-8 bg-neutral-950 border-neutral-800"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Output</Label>
              <textarea 
                value={cmd.output} 
                onChange={(e: any) => state.updateCommand(cmd.id, { output: e.target.value })}
                className="w-full min-h-[60px] bg-neutral-950 border border-neutral-800 rounded-md p-2 text-sm text-neutral-200 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full border-neutral-800 hover:bg-neutral-900" onClick={state.addCommand}>
          <Plus className="w-4 h-4 mr-2" />
          Add Command
        </Button>
      </div>

      <Separator className="bg-neutral-800" />

      <div>
        <h2 className="text-lg font-bold text-white">Appearance</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Terminal Theme</Label>
          <Select value={state.theme} onValueChange={(val: any) => state.updateState({ theme: val })}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hyper">Hyper</SelectItem>
              <SelectItem value="warp">Warp</SelectItem>
              <SelectItem value="iterm">iTerm2</SelectItem>
              <SelectItem value="ubuntu">Ubuntu</SelectItem>
              <SelectItem value="windows">Windows PowerShell</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
