import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import { getBodys, postBody, putBody, deleteBody, activarBody, getMarcas } from "../../services/api";

const empty = { nombre: "", idMarca: "", mililitros: "", precio: "", descripcion: "", imagenUrl: "" };
const FILTROS = ["Todos", "Activos", "Inactivos"];

export default function Bodys() {
  const { onMenuClick } = useOutletContext();
  const [bodys, setBodys] = useState([]);
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
      const [bRes, mRes] = await Promise.all([getBodys(), getMarcas()]);
      setBodys(Array.isArray(bRes.data) ? bRes.data : []);
      setMarcas(Array.isArray(mRes.data) ? mRes.data : []);
    } catch { setBodys([]); setMarcas([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const [marcaAdminFiltro, setMarcaAdminFiltro] = useState("");

  const visibles = bodys
    .filter(b => filtro === "Todos" ? true : filtro === "Activos" ? b.activo : !b.activo)
    .filter(b => !marcaAdminFiltro || b.idMarca === marcaAdminFiltro);

  const openNew = () => { setEditing(null); setForm(empty); setError(""); setModal(true); };
  const openEdit = (b) => {
    setEditing(b);
    setForm({ nombre: b.nombre, idMarca: b.idMarca ?? "", mililitros: b.mililitros, precio: b.precio, descripcion: b.descripcion ?? "", imagenUrl: b.imagenUrl ?? "" });
    setError(""); setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, idMarca: form.idMarca || null, mililitros: parseFloat(form.mililitros), precio: parseFloat(form.precio) };
      if (editing) await putBody(editing.id, payload);
      else await postBody(payload);
      closeModal(); await load();
    } catch (err) { setError(err.response?.data ?? "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (b) => {
    try {
      if (b.activo) await deleteBody(b.id);
      else await activarBody(b.id);
      await load();
    } catch { }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Bodys" subtitle="Gestión de cremas corporales" onMenuClick={onMenuClick}
        actions={
          <button onClick={openNew} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
            <i className="ti ti-plus text-sm" /> Nuevo body
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading ? <p className="text-sm text-gray-400 tracking-wide">Cargando...</p> : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Bodys registrados</span>
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
                    {["Nombre", "Marca", "Mililitros", "Precio", "Estado", "Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((b) => (
                    <tr key={b.id} className={`border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA] ${!b.activo ? "opacity-50" : ""}`}>
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1B1B1B]">{b.nombre}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{b.marca ?? "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{b.mililitros} ml</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">₡{Number(b.precio).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${b.activo ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {b.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(b)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] hover:bg-gray-50 transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => handleToggle(b)}
                            className={`border p-1.5 transition-all ${b.activo ? "border-[#EBEBEB] text-gray-400 hover:text-red-500 hover:bg-red-50" : "border-[#EBEBEB] text-gray-400 hover:text-green-600 hover:bg-green-50"}`}>
                            <i className={`ti ${b.activo ? "ti-eye-off" : "ti-eye"} text-sm`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibles.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No hay bodys {filtro.toLowerCase()}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modal && (
        <Modal title={editing ? "Editar body" : "Nuevo body"} onClose={closeModal}>
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