import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  getPerfumes, getMarcas, postPerfume, putPerfume, deletePerfume,
  getNotas, getNotasPorPerfume, postNotaAPerfume, deleteNotaDePerfume
} from "../../services/api";

const empty = { idMarca: "", nombre: "", genero: "Unisex", descripcion: "", imagenUrl: "" };

export default function Perfumes() {
  const { onMenuClick } = useOutletContext();
  const [perfumes, setPerfumes]       = useState([]);
  const [marcas, setMarcas]           = useState([]);
  const [notasCatalogo, setNotasCat]  = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(false);
  const [confirm, setConfirm]         = useState(null);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(empty);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");

  // Notas del perfume que se está editando
  const [notasPerfume, setNotasPerfume] = useState([]);
  const [notaForm, setNotaForm]         = useState({ idNota: "", intensidad: 5 });
  const [savingNota, setSavingNota]     = useState(false);

  const load = async () => {
    try {
      const [pRes, mRes, nRes] = await Promise.all([getPerfumes(), getMarcas(), getNotas()]);
      setPerfumes(pRes.data ?? []);
      setMarcas(mRes.data ?? []);
      setNotasCat(nRes.data ?? []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty, idMarca: marcas[0]?.id ?? "" });
    setNotasPerfume([]);
    setNotaForm({ idNota: notasCatalogo[0]?.id ?? "", intensidad: 5 });
    setError("");
    setModal(true);
  };

  const openEdit = async (p) => {
    setEditing(p);
    setForm({ idMarca: p.idMarca, nombre: p.nombre, genero: p.genero, descripcion: p.descripcion ?? "", imagenUrl: p.imagenUrl ?? "" });
    setError("");
    setModal(true);
    try {
      const res = await getNotasPorPerfume(p.id);
      setNotasPerfume(Array.isArray(res.data) ? res.data : []);
    } catch { setNotasPerfume([]); }
    setNotaForm({ idNota: notasCatalogo[0]?.id ?? "", intensidad: 5 });
  };

  const closeModal = () => { setModal(false); setEditing(null); setNotasPerfume([]); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (editing) await putPerfume(editing.id, form);
      else         await postPerfume(form);
      closeModal(); await load();
    } catch (err) { setError(err.response?.data ?? "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deletePerfume(id); await load(); }
    catch { } finally { setConfirm(null); }
  };

  const handleAgregarNota = async () => {
    if (!notaForm.idNota || !editing) return;
    setSavingNota(true);
    try {
      await postNotaAPerfume({ idPerfume: editing.id, idNota: notaForm.idNota, intensidad: parseInt(notaForm.intensidad) });
      const res = await getNotasPorPerfume(editing.id);
      setNotasPerfume(Array.isArray(res.data) ? res.data : []);
      await load();
    } catch { }
    finally { setSavingNota(false); }
  };

  const handleEliminarNota = async (idNota) => {
    if (!editing) return;
    try {
      await deleteNotaDePerfume(editing.id, idNota);
      const res = await getNotasPorPerfume(editing.id);
      setNotasPerfume(Array.isArray(res.data) ? res.data : []);
      await load();
    } catch { }
  };

  const filtered = perfumes.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.marca?.toLowerCase().includes(search.toLowerCase())
  );

  const notasDisponibles = notasCatalogo.filter(n =>
    !notasPerfume.some(np => np.idNota === n.id)
  );

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Perfumes"
        subtitle="Gestión del catálogo"
        onMenuClick={onMenuClick}
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 border border-[#EBEBEB] px-3 py-2 bg-white">
              <i className="ti ti-search text-sm text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..." className="text-sm outline-none w-40 placeholder-gray-400" />
            </div>
            <button onClick={openNew} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
              <i className="ti ti-plus text-sm" /> Nuevo
            </button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Perfumes",  value: perfumes.length,                          sub: "en catálogo" },
            { label: "Marcas",    value: marcas.length,                            sub: "registradas" },
            { label: "Completos", value: perfumes.reduce((a,p) => a + (p.variantes?.filter(v=>v.tipo==="Completo").length ?? 0), 0), sub: "frascos" },
            { label: "Decants",   value: perfumes.reduce((a,p) => a + (p.variantes?.filter(v=>v.tipo==="Decant").length ?? 0), 0),   sub: "muestras" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white border border-[#EBEBEB] p-4">
              <p className="text-[10px] tracking-[2px] uppercase text-gray-400 mb-2">{label}</p>
              <p className="text-3xl font-light text-[#1B1B1B]">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Catálogo</span>
              <span className="text-xs text-gray-400">{filtered.length} perfumes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    {["Nombre","Marca","Género","Variantes","Notas","Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1B1B1B]">{p.nombre}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{p.marca}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{p.genero}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block bg-[#F0F0F0] text-gray-500 px-2.5 py-1 text-[10px] tracking-widest uppercase">
                          {p.variantes?.length ?? 0} variantes
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 items-center">
                          {p.notas?.slice(0, 4).map((n) => (
                            <div key={n.nombre} title={n.nombre} className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: n.colorHex }} />
                          ))}
                          {(p.notas?.length ?? 0) > 4 && <span className="text-[10px] text-gray-400">+{p.notas.length - 4}</span>}
                          {(p.notas?.length ?? 0) === 0 && <span className="text-[10px] text-gray-400">Sin notas</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => setConfirm(p.id)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-red-500 transition-all">
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No se encontraron perfumes</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modal && (
        <Modal title={editing ? "Editar perfume" : "Nuevo perfume"} onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Marca</label>
              <select required value={form.idMarca} onChange={(e) => setForm({ ...form, idMarca: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                <option value="">Seleccionar marca...</option>
                {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Nombre</label>
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Género</label>
              <select value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                {["Hombre","Mujer","Unisex"].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Descripción</label>
              <textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">URL de imagen</label>
              <input value={form.imagenUrl} onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
            </div>

            {editing && (
              <div className="border-t border-[#EBEBEB] pt-4">
                <p className="text-[10px] tracking-[2px] uppercase text-gray-400 mb-3">Notas aromáticas</p>

                {notasPerfume.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {notasPerfume.map((n) => (
                      <div key={n.idNota} className="flex items-center justify-between bg-[#FAFAFA] px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: n.colorHex }} />
                          <span className="text-sm text-[#1B1B1B]">{n.nombre}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-sm ${i < n.intensidad ? "bg-[#1B1B1B]" : "bg-[#E0E0E0]"}`} />
                            ))}
                          </div>
                          <button type="button" onClick={() => handleEliminarNota(n.idNota)}
                            className="text-gray-300 hover:text-red-400 transition-colors">
                            <i className="ti ti-x text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {notasDisponibles.length > 0 && (
                  <div className="flex gap-2">
                    <select value={notaForm.idNota} onChange={(e) => setNotaForm({ ...notaForm, idNota: e.target.value })}
                      className="flex-1 border border-[#EBEBEB] px-3 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                      {notasDisponibles.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                    </select>
                    <input type="number" min="1" max="10" value={notaForm.intensidad}
                      onChange={(e) => setNotaForm({ ...notaForm, intensidad: e.target.value })}
                      className="w-16 border border-[#EBEBEB] px-3 py-2 text-sm text-center focus:outline-none focus:border-[#1B1B1B] transition-colors"
                      placeholder="1-10" />
                    <button type="button" onClick={handleAgregarNota} disabled={savingNota}
                      className="border border-[#1B1B1B] px-4 py-2 text-xs tracking-widest uppercase text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-white transition-all disabled:opacity-40">
                      <i className="ti ti-plus text-sm" />
                    </button>
                  </div>
                )}

                {notasDisponibles.length === 0 && notasPerfume.length === 0 && (
                  <p className="text-xs text-gray-400">No hay notas en el catálogo. Créalas primero en la sección Notas.</p>
                )}
                {notasDisponibles.length === 0 && notasPerfume.length > 0 && (
                  <p className="text-xs text-gray-400">Todas las notas del catálogo están asignadas.</p>
                )}
              </div>
            )}

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
        <ConfirmDialog message="¿Eliminar este perfume? Se eliminarán también sus variantes y notas." onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}