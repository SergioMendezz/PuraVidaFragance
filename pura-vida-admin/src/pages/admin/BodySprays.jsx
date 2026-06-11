import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import { getBodySprays, postBodySpray, putBodySpray, deleteBodySpray, activarBodySpray, getPerfumes, getMarcas } from "../../services/api";

const empty = { nombre: "", idMarca: "", idPerfumeBase: "", mililitros: "", precio: "", descripcion: "", imagenUrl: "" };
const FILTROS = ["Todos", "Activos", "Inactivos"];

export default function BodySprays() {
  const { onMenuClick } = useOutletContext();
  const [sprays, setSprays] = useState([]);
  const [perfumes, setPerfumes] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("Activos");

  const load = async () => {
    try {
      const [sRes, pRes, mRes] = await Promise.all([getBodySprays(), getPerfumes(), getMarcas()]);
      setSprays(Array.isArray(sRes.data) ? sRes.data : []);
      setPerfumes(Array.isArray(pRes.data) ? pRes.data : []);
      setMarcas(Array.isArray(mRes.data) ? mRes.data : []);
    } catch { setSprays([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const [marcaAdminFiltro, setMarcaAdminFiltro] = useState("");

  const visibles = sprays
    .filter(s => filtro === "Todos" ? true : filtro === "Activos" ? s.activo : !s.activo)
    .filter(s => !marcaAdminFiltro || s.idMarca === marcaAdminFiltro);

  const openNew = () => { setEditing(null); setForm(empty); setError(""); setModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ nombre: s.nombre, idMarca: s.idMarca ?? "", idPerfumeBase: s.idPerfumeBase ?? "", mililitros: s.mililitros, precio: s.precio, descripcion: s.descripcion ?? "", imagenUrl: s.imagenUrl ?? "" });
    setError(""); setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, idMarca: form.idMarca || null, idPerfumeBase: form.idPerfumeBase || null, mililitros: parseFloat(form.mililitros), precio: parseFloat(form.precio) };
      if (editing) await putBodySpray(editing.id, payload);
      else await postBodySpray(payload);
      closeModal(); await load();
    } catch (err) { setError(err.response?.data ?? "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (s) => {
    try {
      if (s.activo) await deleteBodySpray(s.id);
      else await activarBodySpray(s.id);
      await load();
    } catch { }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Body Sprays" subtitle="Gestión de body sprays" onMenuClick={onMenuClick}
        actions={
          <button onClick={openNew} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
            <i className="ti ti-plus text-sm" /> Nuevo body spray
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading ? <p className="text-sm text-gray-400 tracking-wide">Cargando...</p> : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Body sprays registrados</span>
              <div className="flex items-center gap-3 ml-auto">
                <select value={marcaAdminFiltro} onChange={e => setMarcaAdminFiltro(e.target.value)}
                  className="border border-[#EBEBEB] px-3 py-1 text-[11px] text-gray-500 bg-white outline-none focus:border-[#1B1B1B] transition-colors">
                  <option value="">Todas las marcas</option>
                  {marcas.filter(m => m.activo).map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
                <div className="flex items-center gap-1">
                  {FILTROS.map(f => (
                    <button key={f} onClick={() => setFiltro(f)}
                      className={`px-3 py-1 text-[10px] tracking-[2px] uppercase transition-colors ${filtro === f ? "bg-[#1B1B1B] text-white" : "text-gray-400 hover:text-[#1B1B1B]"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    {["Nombre", "Marca", "Perfume base", "Mililitros", "Precio", "Estado", "Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((s) => (
                    <tr key={s.id} className={`border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA] ${!s.activo ? "opacity-50" : ""}`}>
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1B1B1B]">{s.nombre}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{s.marca ?? "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {s.nombrePerfumeBase
                          ? <span className="inline-block bg-[#F0F0F0] text-gray-600 px-2.5 py-1 text-[10px] tracking-widest uppercase">{s.nombrePerfumeBase}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{s.mililitros} ml</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">₡{Number(s.precio).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${s.activo ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {s.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(s)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] hover:bg-gray-50 transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => handleToggle(s)}
                            className={`border p-1.5 transition-all ${s.activo ? "border-[#EBEBEB] text-gray-400 hover:text-red-500 hover:bg-red-50" : "border-[#EBEBEB] text-gray-400 hover:text-green-600 hover:bg-green-50"}`}>
                            <i className={`ti ${s.activo ? "ti-eye-off" : "ti-eye"} text-sm`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibles.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">No hay body sprays {filtro.toLowerCase()}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modal && (
        <Modal title={editing ? "Editar body spray" : "Nuevo body spray"} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Nombre</label>
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Marca</label>
              <select value={form.idMarca} onChange={(e) => setForm({ ...form, idMarca: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                <option value="">Sin marca</option>
                {marcas.filter(m => m.activo).map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Perfume base <span className="text-gray-300 normal-case tracking-normal">(opcional)</span></label>
              <select value={form.idPerfumeBase} onChange={(e) => setForm({ ...form, idPerfumeBase: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                <option value="">Sin perfume base</option>
                {perfumes.filter(p => p.activo).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Mililitros</label>
                <input required type="number" min="0.1" step="0.1" value={form.mililitros}
                  onChange={(e) => setForm({ ...form, mililitros: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Precio (₡)</label>
                <input required type="number" min="0" step="1" value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">URL de imagen</label>
              <input value={form.imagenUrl} onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Descripción</label>
              <textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors resize-none" />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 border border-[#EBEBEB] py-2.5 text-xs tracking-widest uppercase text-gray-500 hover:bg-gray-50 transition-all">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 bg-[#1B1B1B] text-white py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}