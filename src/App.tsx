import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import CanvasEditor from "./pages/CanvasEditor";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* We've replaced individual studios with the unified CanvasEditor */}
        <Route index element={<CanvasEditor />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
