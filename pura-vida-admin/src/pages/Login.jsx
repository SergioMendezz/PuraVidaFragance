import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/admin/perfumes");
    } catch {
      setError("Credenciales inválidas. Verifica tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B1B1B] flex-col items-center justify-center p-16">
        <p className="text-[10px] tracking-[6px] text-white/30 uppercase mb-3">Fragance</p>
        <h1 className="text-6xl font-semibold text-white tracking-wider leading-tight text-center">
          PURA<br/>VIDA
        </h1>
        <div className="mt-12 w-16 h-px bg-white/20" />
        <p className="mt-6 text-[11px] tracking-[3px] text-white/30 uppercase">
          Panel de administración
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 text-center">
            <p className="text-[9px] tracking-[4px] text-gray-400 uppercase mb-1">Fragance</p>
            <h1 className="text-3xl font-semibold text-[#1B1B1B] tracking-wider">PURA VIDA</h1>
          </div>

          <h2 className="text-xs tracking-[4px] uppercase text-gray-400 mb-8">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-[#EBEBEB] px-4 py-3 text-sm text-[#1B1B1B] bg-white focus:outline-none focus:border-[#1B1B1B] transition-colors"
                placeholder="admin@puravidafragance.com"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border border-[#EBEBEB] px-4 py-3 text-sm text-[#1B1B1B] bg-white focus:outline-none focus:border-[#1B1B1B] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 tracking-wide">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B1B1B] text-white py-3 text-xs tracking-[3px] uppercase hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}