import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getBodys, postBody, putBody, deleteBody } from "../../services/api";

const empty = { nombre: "", mililitros: "", precio: "", descripcion: "", imagenUrl: "" };

export default function Bodys() {
  const { onMenuClick } = useOutletContext();
  const [bodys, setBodys]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(empty);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const load = async () => {
    try {
      const res = await getBodys();
      setBodys(Array.isArray(res.data) ? res.data : []);
    } catch { setBodys([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(empty); setError(""); setModal(true); };
  const openEdit = (b) => {
    setEditing(b);
    setForm({
      nombre:     b.nombre,
      mililitros: b.mililitros,
      precio:     b.precio,
      descripcion: b.descripcion ?? "",
      imagenUrl:  b.imagenUrl ?? "",
    });
    setError("");
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = {
        ...form,
        mililitros: parseFloat(form.mililitros),
        precio:     parseFloat(form.precio),
      };
      if (editing) await putBody(editing.id, payload);
      else         await postBody(payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.response?.data ?? "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteBody(id); await load(); }
    catch { } finally { setConfirm(null); }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Bodys"
        subtitle="Gestión de cremas corporales"
        onMenuClick={onMenuClick}
        actions={
          <button onClick={openNew} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
            <i className="ti ti-plus text-sm" /> Nuevo body
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading ? (
          <p className="text-sm text-gray-400 tracking-wide">Cargando...</p>
        ) : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Bodys registrados</span>
              <span className="text-xs text-gray-400">{bodys.length} productos</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    {["Nombre", "Mililitros", "Precio", "Descripción", "Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodys.map((b) => (
                    <tr key={b.id} className="border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1B1B1B]">{b.nombre}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{b.mililitros} ml</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">₡{Number(b.precio).toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 max-w-xs truncate">{b.descripcion ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(b)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] hover:bg-gray-50 transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => setConfirm(b.id)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bodys.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">No hay bodys registrados</td></tr>
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
          message="¿Eliminar este body?"
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}