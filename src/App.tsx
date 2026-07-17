import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import CanvasEditor from "./pages/CanvasEditor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* We've replaced individual studios with the unified CanvasEditor */}
        <Route index element={<CanvasEditor />} />
      </Route>
    </Routes>
  );
}

export default App;
