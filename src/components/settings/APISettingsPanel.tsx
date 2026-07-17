import { useApiStore } from "../../stores/useApiStore";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export default function APISettingsPanel() {
  const state = useApiStore();
  const updateState = state.updateState;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Request Details</h3>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1 space-y-2">
            <Label>Method</Label>
            <Select value={state.method} onValueChange={(val: any) => updateState({ method: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>URL</Label>
            <Input 
              value={state.url} 
              onChange={(e) => updateState({ url: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Input 
              type="number"
              value={state.statusCode} 
              onChange={(e) => updateState({ statusCode: Number(e.target.value) })}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <Input 
              value={state.time} 
              onChange={(e) => updateState({ time: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label>Size</Label>
            <Input 
              value={state.size} 
              onChange={(e) => updateState({ size: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full grid grid-cols-2 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => updateState({ activeTab: "request" })}
            className={`text-xs py-1.5 rounded-md font-semibold transition-colors ${state.activeTab === "request" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            Request Body
          </button>
          <button
            onClick={() => updateState({ activeTab: "response" })}
            className={`text-xs py-1.5 rounded-md font-semibold transition-colors ${state.activeTab === "response" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            Response Body
          </button>
        </div>

        <div className="flex h-[200px] w-full border border-neutral-800 rounded-lg overflow-hidden bg-[#1e1e1e] mt-2 relative">
          {state.activeTab === "request" && (
            <Editor
              key="request-editor"
              height="100%"
              width="100%"
              language="json"
              theme="vs-dark"
              value={state.requestBody}
              onChange={(val) => updateState({ requestBody: val ?? "" })}
              options={{
                minimap: { enabled: false },
                padding: { top: 12 },
                fontSize: 12,
                scrollBeyondLastLine: false,
                wordWrap: "on"
              }}
            />
          )}
          {state.activeTab === "response" && (
            <Editor
              key="response-editor"
              height="100%"
              width="100%"
              language="json"
              theme="vs-dark"
              value={state.responseBody}
              onChange={(val) => updateState({ responseBody: val ?? "" })}
              options={{
                minimap: { enabled: false },
                padding: { top: 12 },
                fontSize: 12,
                scrollBeyondLastLine: false,
                wordWrap: "on"
              }}
            />
          )}
        </div>
      </div>

      <div className="space-y-4 border-t border-neutral-800 pt-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Appearance</h3>
        
        <div className="space-y-2">
          <Label>Card Layout</Label>
          <Select value={state.apiLayout} onValueChange={(val: any) => updateState({ apiLayout: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="response-only">Response Only</SelectItem>
              <SelectItem value="request-only">Request Only</SelectItem>
              <SelectItem value="split">Split Vertical</SelectItem>
              <SelectItem value="tabs">Tabs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
            min={10} max={48} step={1} 
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
