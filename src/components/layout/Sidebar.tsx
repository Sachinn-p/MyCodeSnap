import { NavLink } from "react-router-dom";
import { 
  Code2, 
  GitCompare, 
  TerminalSquare, 
  Braces, 
  Database, 
  Globe2, 
  Workflow,
  Camera
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/code", icon: Code2, label: "Code Snapshot" },
  { path: "/diff", icon: GitCompare, label: "Git Diff" },
  { path: "/terminal", icon: TerminalSquare, label: "Terminal" },
  { path: "/api", icon: Braces, label: "API Response" },
  { path: "/db", icon: Database, label: "Database Query" },
  { path: "/http", icon: Globe2, label: "HTTP Request" },
  { path: "/canvas", icon: Workflow, label: "Architecture" },
];

export default function Sidebar() {
  return (
    <aside className="w-16 lg:w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-neutral-800">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-neutral-700 flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="MyCodeSnap Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="ml-3 font-bold tracking-tight text-neutral-100 hidden lg:block whitespace-nowrap">
          MyCode<span className="text-neutral-500">Snap</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center p-3 lg:px-4 lg:py-3 rounded-lg transition-colors group ${
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 font-semibold" 
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="ml-3 hidden lg:block whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-neutral-800 hidden lg:block">
        <p className="text-xs text-neutral-600 font-semibold tracking-wider uppercase">Built for Devs</p>
      </div>
    </aside>
  );
}
