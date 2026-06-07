import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Perfumes   from "./pages/admin/Perfumes";
import Marcas     from "./pages/admin/Marcas";
import Notas      from "./pages/admin/Notas";
import Variantes  from "./pages/admin/Variantes";
import Bodys      from "./pages/admin/Bodys";
import BodySprays from "./pages/admin/BodySprays";
import Sets       from "./pages/admin/Sets";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="perfumes" replace />} />
            <Route path="perfumes"   element={<Perfumes />} />
            <Route path="marcas"     element={<Marcas />} />
            <Route path="notas"      element={<Notas />} />
            <Route path="variantes"  element={<Variantes />} />
            <Route path="bodys"      element={<Bodys />} />
            <Route path="bodysprays" element={<BodySprays />} />
            <Route path="sets"       element={<Sets />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}