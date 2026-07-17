import { Outlet } from "react-router-dom";


export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white font-sans selection:bg-white/20 overflow-hidden">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
