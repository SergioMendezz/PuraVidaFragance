import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Perfumes from "./pages/Perfumes";
import Bodys from "./pages/Bodys";
import BodySprays from "./pages/BodySprays";
import Sets from "./pages/Sets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Inicio />} />
        <Route path="/perfumes"    element={<Perfumes />} />
        <Route path="/bodys"       element={<Bodys />} />
        <Route path="/bodysprays"  element={<BodySprays />} />
        <Route path="/sets"        element={<Sets />} />
        <Route path="*"            element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}