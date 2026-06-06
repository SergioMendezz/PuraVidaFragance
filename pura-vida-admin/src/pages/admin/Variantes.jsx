import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getPerfumes, getVariantesPorPerfume, postVariante, putVariante, deleteVariante } from "../../services/api";

const empty = { idPerfume: "", tipo: "Completo", mililitros: "", precio: "", stock: "" };

export default function Variantes() {
  const { onMenuClick } = useOutletContext();
  const [perfumes, setPerfumes]   = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [selected, setSelected]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [modal, setModal]         = useState(false);
  const [confirm, setConfirm]     = useState(null);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    getPerfumes().then(r => {
      setPerfumes(r.data ?? []);
      if (r.data?.length) setSelected(r.data[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    getVariantesPorPerfume(selected)
      .then(r => setVariantes(Array.isArray(r.data) ? r.data : []))
      .catch(() => setVariantes([]))
      .finally(() => setLoading(false));
  }, [selected]);

  const openNew  = () => { setEditing(null); setForm({ ...empty, idPerfume: selected }); setError(""); setModal(true); };
  const openEdit = (v) => { setEditing(v); setForm({ idPerfume: selected, tipo: v.tipo, mililitros: v.mililitros, precio: v.precio, stock: v.stock }); setError(""); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const reload = () => {
    if (!selected) return;
    getVariantesPorPerfume(selected).then(r => setVariantes(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, mililitros: parseFloat(form.mililitros), precio: parseFloat(form.precio), stock: parseInt(form.stock) };
      if (editing) await putVariante(editing.id, payload);
      else         await postVariante(payload);
      closeModal(); reload();
    } catch (err) { setError(err.response?.data ?? "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteVariante(id); reload(); }
    catch { } finally { setConfirm(null); }
  };

  const perfumeName = perfumes.find(p => p.id === selected)?.nombre ?? "";

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Variantes"
        subtitle="Completos y decants por perfume"
        onMenuClick={onMenuClick}
        actions={
          <button onClick={openNew} disabled={!selected} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-40">
            <i className="ti ti-plus text-sm" /> Nueva variante
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-5">
          <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-2">Perfume</label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}
            className="border border-[#EBEBEB] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1B1B1B] transition-colors w-full max-w-sm">
            {perfumes.map(p => <option key={p.id} value={p.id}>{p.nombre} — {p.marca}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">{perfumeName}</span>
              <span className="text-xs text-gray-400">{variantes.length} variantes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    {["Tipo","Mililitros","Precio","Stock","Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {variantes.map((v) => (
                    <tr key={v.id} className="border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3.5">
                        <span className={`inline-block px-2.5 py-1 text-[10px] tracking-widest uppercase ${v.tipo === "Completo" ? "bg-[#F0F0F0] text-gray-600" : "bg-[#1B1B1B] text-white"}`}>
                          {v.tipo}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{v.mililitros} ml</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1B1B1B]">₡{Number(v.precio).toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{v.stock} uds.</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(v)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => setConfirm(v.id)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-red-500 transition-all">
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {variantes.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">No hay variantes para este perfume</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modal && (
        <Modal title={editing ? "Editar variante" : "Nueva variante"} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                <option>Completo</option>
                <option>Decant</option>
              </select>
            </div>
            {[
              { label: "Mililitros", key: "mililitros", type: "number", step: "0.1" },
              { label: "Precio (₡)", key: "precio",     type: "number", step: "1"   },
              { label: "Stock",      key: "stock",      type: "number", step: "1"   },
            ].map(({ label, key, type, step }) => (
              <div key={key}>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">{label}</label>
                <input required type={type} step={step} min="0" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
              </div>
            ))}
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

      {confirm && (
        <ConfirmDialog message="¿Eliminar esta variante?" onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}