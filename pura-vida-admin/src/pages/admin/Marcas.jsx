import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getMarcas, postMarca, putMarca, deleteMarca } from "../../services/api";

const empty = { nombre: "", paisOrigen: "", descripcion: "", logoUrl: "" };

export default function Marcas() {
  const { onMenuClick } = useOutletContext();
  const [marcas, setMarcas]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [confirm, setConfirm]   = useState(null);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const load = async () => {
    try {
      const res = await getMarcas();
      setMarcas(Array.isArray(res.data) ? res.data : []);
    } catch { setMarcas([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(empty); setError(""); setModal(true); };
  const openEdit = (m) => { setEditing(m); setForm({ nombre: m.nombre, paisOrigen: m.paisOrigen ?? "", descripcion: m.descripcion ?? "", logoUrl: m.logoUrl ?? "" }); setError(""); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editing) await putMarca(editing.id, form);
      else         await postMarca(form);
      closeModal();
      await load();
    } catch (err) {
      setError(err.response?.data ?? "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteMarca(id); await load(); }
    catch { }
    finally { setConfirm(null); }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Marcas"
        subtitle="Gestión de marcas"
        onMenuClick={onMenuClick}
        actions={
          <button onClick={openNew} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
            <i className="ti ti-plus text-sm" /> Nueva marca
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading ? (
          <p className="text-sm text-gray-400 tracking-wide">Cargando...</p>
        ) : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Marcas registradas</span>
              <span className="text-xs text-gray-400">{marcas.length} marcas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    {["Nombre","País","Descripción","Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marcas.map((m) => (
                    <tr key={m.id} className="border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1B1B1B]">{m.nombre}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{m.paisOrigen ?? "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 max-w-xs truncate">{m.descripcion ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(m)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] hover:bg-gray-50 transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => setConfirm(m.id)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {marcas.length === 0 && (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">No hay marcas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modal && (
        <Modal title={editing ? "Editar marca" : "Nueva marca"} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { label: "Nombre",      key: "nombre",      required: true  },
              { label: "País origen", key: "paisOrigen",  required: false },
              { label: "Logo URL",    key: "logoUrl",     required: false },
            ].map(({ label, key, required }) => (
              <div key={key}>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">{label}</label>
                <input
                  required={required}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Descripción</label>
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors resize-none"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="flex-1 border border-[#EBEBEB] py-2.5 text-xs tracking-widest uppercase text-gray-500 hover:bg-gray-50 transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-[#1B1B1B] text-white py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          message="¿Eliminar esta marca? Los perfumes asociados quedarán sin marca."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}