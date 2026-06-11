import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import { getNotas, postNota, putNota, deleteNota, activarNota } from "../../services/api";

const empty = { nombre: "", colorHex: "#1B1B1B" };
const FILTROS = ["Todos", "Activos", "Inactivos"];

export default function Notas() {
  const { onMenuClick } = useOutletContext();
  const [notas, setNotas]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(empty);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [filtro, setFiltro]   = useState("Activos");

  const load = async () => {
    try { const res = await getNotas(); setNotas(Array.isArray(res.data) ? res.data : []); }
    catch { setNotas([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const visibles = notas.filter(n =>
    filtro === "Todos" ? true : filtro === "Activos" ? n.activo : !n.activo
  );

  const openNew  = () => { setEditing(null); setForm(empty); setError(""); setModal(true); };
  const openEdit = (n) => { setEditing(n); setForm({ nombre: n.nombre, colorHex: n.colorHex }); setError(""); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (editing) await putNota(editing.id, form);
      else         await postNota(form);
      closeModal(); await load();
    } catch (err) { setError(err.response?.data ?? "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (n) => {
    try {
      if (n.activo) await deleteNota(n.id);
      else          await activarNota(n.id);
      await load();
    } catch {}
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Notas" subtitle="Catálogo de notas aromáticas" onMenuClick={onMenuClick}
        actions={
          <button onClick={openNew} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
            <i className="ti ti-plus text-sm" /> Nueva nota
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading ? <p className="text-sm text-gray-400 tracking-wide">Cargando...</p> : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Notas aromáticas</span>
              <div className="flex items-center gap-1">
                {FILTROS.map(f => (
                  <button key={f} onClick={() => setFiltro(f)}
                    className={`px-3 py-1 text-[10px] tracking-[2px] uppercase transition-colors ${filtro === f ? "bg-[#1B1B1B] text-white" : "text-gray-400 hover:text-[#1B1B1B]"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#F0F0F0]">
              {visibles.map((n) => (
                <div key={n.id} className={`bg-white p-4 flex items-center justify-between ${!n.activo ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: n.colorHex }} />
                    <div>
                      <p className="text-sm font-medium text-[#1B1B1B]">{n.nombre}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{n.colorHex}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(n)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] transition-all">
                      <i className="ti ti-edit text-sm" />
                    </button>
                    <button onClick={() => handleToggle(n)}
                      className={`border p-1.5 transition-all ${n.activo ? "border-[#EBEBEB] text-gray-400 hover:text-red-500 hover:bg-red-50" : "border-[#EBEBEB] text-gray-400 hover:text-green-600 hover:bg-green-50"}`}>
                      <i className={`ti ${n.activo ? "ti-eye-off" : "ti-eye"} text-sm`} />
                    </button>
                  </div>
                </div>
              ))}
              {visibles.length === 0 && (
                <div className="col-span-3 px-5 py-8 text-center text-sm text-gray-400 bg-white">No hay notas {filtro.toLowerCase()}</div>
              )}
            </div>
          </div>
        )}
      </main>

      {modal && (
        <Modal title={editing ? "Editar nota" : "Nueva nota"} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Nombre</label>
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Color</label>
              <div className="flex gap-3 items-center">
                <input type="color" value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                  className="w-12 h-10 border border-[#EBEBEB] cursor-pointer p-0.5" />
                <input value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                  placeholder="#1B1B1B" className="flex-1 border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
              </div>
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