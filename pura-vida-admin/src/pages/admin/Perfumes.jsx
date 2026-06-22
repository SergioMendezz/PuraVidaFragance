import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import {
  getPerfumes, getMarcas, postPerfume, putPerfume, deletePerfume, activarPerfume,
  getNotas, getNotasPorPerfume, postNotaAPerfume, deleteNotaDePerfume,
  getVariantesPorPerfume, postVariante, deleteVariante
} from "../../services/api";

const emptyPerfume  = { idMarca: "", nombre: "", genero: "Unisex", descripcion: "", imagenUrl: "" };
const emptyVariante = { tipo: "Completo", mililitros: "", precio: "", stock: "" };
const FILTROS = ["Todos", "Activos", "Inactivos"];

export default function Perfumes() {
  const { onMenuClick } = useOutletContext();
  const [perfumes, setPerfumes]       = useState([]);
  const [marcas, setMarcas]           = useState([]);
  const [notasCatalogo, setNotasCat]  = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filtro, setFiltro]           = useState("Activos");
  const [marcaAdminFiltro, setMarcaAdminFiltro] = useState("");

  // Modal perfume
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);  // null = nuevo, objeto = editar
  const [perfumeId, setPerfumeId] = useState(null); // Id del perfume recién creado o editado
  const [form, setForm]         = useState(emptyPerfume);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [paso, setPaso]         = useState(1); // 1 = datos básicos, 2 = notas y variantes

  // Notas
  const [notasPerfume, setNotasPerfume] = useState([]);
  const [notaForm, setNotaForm]         = useState({ idNota: "", intensidad: 5 });
  const [savingNota, setSavingNota]     = useState(false);

  // Variantes en modal perfume
  const [variantesPerfume, setVariantesPerfume] = useState([]);
  const [varianteForm, setVarianteForm]         = useState(emptyVariante);
  const [savingVariante, setSavingVariante]     = useState(false);

  // Modal variante rápida desde tabla
  const [modalVariante, setModalVariante] = useState(false);
  const [perfumeVariante, setPerfumeVariante] = useState(null);
  const [quickVarianteForm, setQuickVarianteForm] = useState(emptyVariante);
  const [savingQuick, setSavingQuick] = useState(false);
  const [errorQuick, setErrorQuick]   = useState("");

  const load = async () => {
    try {
      const [pRes, mRes, nRes] = await Promise.all([getPerfumes(), getMarcas(), getNotas()]);
      setPerfumes(Array.isArray(pRes.data) ? pRes.data : []);
      setMarcas(Array.isArray(mRes.data) ? mRes.data : []);
      setNotasCat(Array.isArray(nRes.data) ? nRes.data : []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const visibles = perfumes
    .filter(p => filtro === "Todos" ? true : filtro === "Activos" ? p.activo : !p.activo)
    .filter(p => !marcaAdminFiltro || p.idMarca === marcaAdminFiltro)
    .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca?.toLowerCase().includes(search.toLowerCase()));

  // ── Abrir modal nuevo ──
  const openNew = () => {
    setEditing(null);
    setPerfumeId(null);
    setForm({ ...emptyPerfume, idMarca: marcas.find(m => m.activo)?.id ?? "" });
    setNotasPerfume([]);
    setVariantesPerfume([]);
    setNotaForm({ idNota: notasCatalogo.find(n => n.activo)?.id ?? "", intensidad: 5 });
    setVarianteForm(emptyVariante);
    setError(""); setPaso(1); setModal(true);
  };

  // ── Abrir modal editar ──
  const openEdit = async (p) => {
    setEditing(p);
    setPerfumeId(p.id);
    setForm({ idMarca: p.idMarca, nombre: p.nombre, genero: p.genero, descripcion: p.descripcion ?? "", imagenUrl: p.imagenUrl ?? "" });
    setError(""); setPaso(2); setModal(true);
    try {
      const [nRes, vRes] = await Promise.all([
        getNotasPorPerfume(p.id),
        getVariantesPorPerfume(p.id)
      ]);
      setNotasPerfume(Array.isArray(nRes.data) ? nRes.data : []);
      setVariantesPerfume(Array.isArray(vRes.data) ? vRes.data : []);
    } catch { setNotasPerfume([]); setVariantesPerfume([]); }
    setNotaForm({ idNota: notasCatalogo.find(n => n.activo)?.id ?? "", intensidad: 5 });
    setVarianteForm(emptyVariante);
  };

  const closeModal = () => {
    setModal(false); setEditing(null); setPerfumeId(null);
    setNotasPerfume([]); setVariantesPerfume([]); setPaso(1);
  };

  // ── Guardar datos básicos del perfume (paso 1) ──
  const handleSavePerfume = async (e) => {
  e.preventDefault(); setSaving(true); setError("");
  try {
    if (editing) {
      await putPerfume(editing.id, form);
      setPerfumeId(editing.id);
    } else {
      const res = await postPerfume(form);
      const nuevoId = res.data;
      setPerfumeId(nuevoId);
      setNotasPerfume([]);
      setVariantesPerfume([]);
      setNotaForm({ idNota: notasCatalogo.find(n => n.activo)?.id ?? "", intensidad: 5 });
    }
    await load();
    setPaso(2);
  } catch (err) { setError(err.response?.data ?? "Error al guardar"); }
  finally { setSaving(false); }
};

  // ── Toggle activo/inactivo ──
  const handleToggle = async (p) => {
    try {
      if (p.activo) await deletePerfume(p.id);
      else          await activarPerfume(p.id);
      await load();
    } catch { }
  };

  // ── Notas ──
  const handleAgregarNota = async () => {
  if (!notaForm.idNota || !perfumeId) return;
  setSavingNota(true);
  try {
    await postNotaAPerfume({ idPerfume: perfumeId, idNota: notaForm.idNota, intensidad: parseInt(notaForm.intensidad) });
    const res = await getNotasPorPerfume(perfumeId);
    const nuevasNotas = Array.isArray(res.data) ? res.data : [];
    setNotasPerfume(nuevasNotas);
    // Seleccionar automáticamente la siguiente nota disponible
    const disponibles = notasCatalogo.filter(n => n.activo && !nuevasNotas.some(np => np.idNota === n.id));
    setNotaForm({ idNota: disponibles[0]?.id ?? "", intensidad: 5 });
    await load();
  } catch { }
  finally { setSavingNota(false); }
};

  const handleEliminarNota = async (idNota) => {
    if (!perfumeId) return;
    try {
      await deleteNotaDePerfume(perfumeId, idNota);
      const res = await getNotasPorPerfume(perfumeId);
      setNotasPerfume(Array.isArray(res.data) ? res.data : []);
      await load();
    } catch { }
  };

  // ── Variantes en modal ──
  const handleAgregarVariante = async () => {
  if (!perfumeId || !varianteForm.mililitros || !varianteForm.precio) return;
  setSavingVariante(true);
  try {
    await postVariante({
      idPerfume:  perfumeId,
      tipo:       varianteForm.tipo,
      mililitros: parseFloat(varianteForm.mililitros),
      precio:     parseFloat(varianteForm.precio),
      stock:      parseInt(varianteForm.stock || "0"),
    });
    const res = await getVariantesPorPerfume(perfumeId);
    setVariantesPerfume(Array.isArray(res.data) ? res.data : []);
    setVarianteForm(emptyVariante);
    await load();
  } catch (err) {
    console.error("Error al agregar variante:", err);
  }
  finally { setSavingVariante(false); }
};

  const handleEliminarVariante = async (idVariante) => {
    if (!perfumeId) return;
    try {
      await deleteVariante(idVariante);
      const res = await getVariantesPorPerfume(perfumeId);
      setVariantesPerfume(Array.isArray(res.data) ? res.data : []);
      await load();
    } catch { }
  };

  // ── Modal variante rápida desde tabla ──
  const openQuickVariante = (p) => {
    setPerfumeVariante(p);
    setQuickVarianteForm(emptyVariante);
    setErrorQuick(""); setModalVariante(true);
  };

  const handleQuickVariante = async (e) => {
    e.preventDefault(); setSavingQuick(true); setErrorQuick("");
    try {
      await postVariante({
        idPerfume: perfumeVariante.id,
        tipo:       quickVarianteForm.tipo,
        mililitros: parseFloat(quickVarianteForm.mililitros),
        precio:     parseFloat(quickVarianteForm.precio),
        stock:      parseInt(quickVarianteForm.stock || 0),
      });
      setModalVariante(false); setPerfumeVariante(null);
      await load();
    } catch (err) { setErrorQuick(err.response?.data ?? "Error al guardar"); }
    finally { setSavingQuick(false); }
  };

  const notasDisponibles = notasCatalogo.filter(n =>
    n.activo && !notasPerfume.some(np => np.idNota === n.id)
  );

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Perfumes" subtitle="Gestión del catálogo" onMenuClick={onMenuClick}
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
            { label: "Total",     value: perfumes.length,                        sub: "perfumes" },
            { label: "Activos",   value: perfumes.filter(p => p.activo).length,  sub: "en tienda" },
            { label: "Completos", value: perfumes.reduce((a, p) => a + (p.variantes?.filter(v => v.tipo === "Completo").length ?? 0), 0), sub: "frascos" },
            { label: "Decants",   value: perfumes.reduce((a, p) => a + (p.variantes?.filter(v => v.tipo === "Decant").length ?? 0), 0), sub: "muestras" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white border border-[#EBEBEB] p-4">
              <p className="text-[10px] tracking-[2px] uppercase text-gray-400 mb-2">{label}</p>
              <p className="text-3xl font-light text-[#1B1B1B]">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {loading ? <p className="text-sm text-gray-400">Cargando...</p> : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Catálogo</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{visibles.length} perfumes</span>
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
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    {["Nombre", "Marca", "Género", "Variantes", "Notas", "Estado", "Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((p) => (
                    <tr key={p.id} className={`border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA] ${!p.activo ? "opacity-50" : ""}`}>
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
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${p.activo ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {p.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} title="Editar"
                            className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => openQuickVariante(p)} title="Agregar variante"
                            className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <i className="ti ti-box text-sm" />
                          </button>
                          <button onClick={() => handleToggle(p)} title={p.activo ? "Desactivar" : "Activar"}
                            className={`border p-1.5 transition-all ${p.activo ? "border-[#EBEBEB] text-gray-400 hover:text-red-500 hover:bg-red-50" : "border-[#EBEBEB] text-gray-400 hover:text-green-600 hover:bg-green-50"}`}>
                            <i className={`ti ${p.activo ? "ti-eye-off" : "ti-eye"} text-sm`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibles.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">No hay perfumes {filtro.toLowerCase()}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Modal perfume (crear/editar) ── */}
      {modal && (
        <Modal
          title={
            paso === 1
              ? (editing ? "Editar perfume" : "Nuevo perfume")
              : (editing ? `Editar — ${editing.nombre}` : `Creado — ${form.nombre}`)
          }
          onClose={closeModal}>

          {/* Indicador de paso */}
          {!editing && (
            <div className="flex items-center gap-2 mb-4">
              <div className={`flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase ${paso === 1 ? "text-[#1B1B1B] font-medium" : "text-gray-400"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paso === 1 ? "bg-[#1B1B1B] text-white" : "bg-green-500 text-white"}`}>
                  {paso === 1 ? "1" : <i className="ti ti-check text-xs" />}
                </div>
                Datos básicos
              </div>
              <div className="flex-1 h-px bg-[#EBEBEB]" />
              <div className={`flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase ${paso === 2 ? "text-[#1B1B1B] font-medium" : "text-gray-400"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paso === 2 ? "bg-[#1B1B1B] text-white" : "bg-[#EBEBEB] text-gray-400"}`}>
                  2
                </div>
                Notas y variantes
              </div>
            </div>
          )}

          {/* Paso 1: datos básicos */}
          {paso === 1 && (
            <form onSubmit={handleSavePerfume} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Marca</label>
                <select required value={form.idMarca} onChange={(e) => setForm({ ...form, idMarca: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                  <option value="">Seleccionar marca...</option>
                  {marcas.filter(m => m.activo).map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
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
                  {["Hombre", "Mujer", "Unisex"].map(g => <option key={g}>{g}</option>)}
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
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-[#EBEBEB] py-2.5 text-xs tracking-widest uppercase text-gray-500 hover:bg-gray-50 transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#1B1B1B] text-white py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50">
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar y continuar →"}
                </button>
              </div>
            </form>
          )}

          {/* Paso 2: notas y variantes */}
          {paso === 2 && (
            <div className="space-y-6">

              {/* Notas aromáticas */}
              <div>
                <p className="text-[10px] tracking-[2px] uppercase text-gray-400 mb-3">Notas aromáticas</p>
                {notasPerfume.length > 0 && (
                  <div className="space-y-2 mb-3">
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
                {notasDisponibles.length > 0 ? (
                  <div className="flex gap-2">
                    <select value={notaForm.idNota} onChange={(e) => setNotaForm({ ...notaForm, idNota: e.target.value })}
                      className="flex-1 border border-[#EBEBEB] px-3 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                      {notasDisponibles.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                    </select>
                    <input type="number" min="1" max="10" value={notaForm.intensidad}
                      onChange={(e) => setNotaForm({ ...notaForm, intensidad: e.target.value })}
                      className="w-16 border border-[#EBEBEB] px-3 py-2 text-sm text-center focus:outline-none focus:border-[#1B1B1B] transition-colors" />
                    <button type="button" onClick={handleAgregarNota} disabled={savingNota}
                      className="border border-[#1B1B1B] px-4 py-2 text-xs tracking-widest uppercase text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-white transition-all disabled:opacity-40">
                      <i className="ti ti-plus text-sm" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    {notasPerfume.length === 0 ? "No hay notas activas en el catálogo." : "Todas las notas están asignadas."}
                  </p>
                )}
              </div>

              {/* Variantes */}
              <div className="border-t border-[#EBEBEB] pt-4">
                <p className="text-[10px] tracking-[2px] uppercase text-gray-400 mb-3">Variantes</p>

                {variantesPerfume.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {variantesPerfume.map((v) => (
                      <div key={v.id} className="flex items-center justify-between bg-[#FAFAFA] px-3 py-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${v.tipo === "Completo" ? "bg-[#F0F0F0] text-gray-600" : "bg-[#1B1B1B] text-white"}`}>
                            {v.tipo}
                          </span>
                          <span className="text-sm text-gray-600">{v.mililitros}ml</span>
                          <span className="text-sm font-medium text-[#1B1B1B]">₡{Number(v.precio).toLocaleString()}</span>
                          <span className="text-xs text-gray-400">{v.stock} uds.</span>
                        </div>
                        <button type="button" onClick={() => handleEliminarVariante(v.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors">
                          <i className="ti ti-x text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2">
                  <select value={varianteForm.tipo} onChange={(e) => setVarianteForm({ ...varianteForm, tipo: e.target.value })}
                    className="border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                    <option>Completo</option>
                    <option>Decant</option>
                  </select>
                  <input type="number" placeholder="ml" min="0.1" step="0.1" value={varianteForm.mililitros}
                    onChange={(e) => setVarianteForm({ ...varianteForm, mililitros: e.target.value })}
                    className="border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
                  <input type="number" placeholder="₡ precio" min="0" value={varianteForm.precio}
                    onChange={(e) => setVarianteForm({ ...varianteForm, precio: e.target.value })}
                    className="border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
                  <div className="flex gap-1">
                    <input type="number" placeholder="stock" min="0" value={varianteForm.stock}
                      onChange={(e) => setVarianteForm({ ...varianteForm, stock: e.target.value })}
                      className="flex-1 border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
                    <button type="button" onClick={handleAgregarVariante} disabled={savingVariante}
                      className="border border-[#1B1B1B] px-3 py-2 text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-white transition-all disabled:opacity-40">
                      <i className="ti ti-plus text-sm" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Tipo · ml · precio · stock</p>
              </div>

              <div className="flex gap-3 pt-2 border-t border-[#EBEBEB]">
                <button type="button" onClick={() => setPaso(1)}
                className="border border-[#EBEBEB] px-4 py-2.5 text-xs tracking-widest uppercase text-gray-500 hover:bg-gray-50 transition-all">
                ← Editar datos
                </button>
                <button type="button" onClick={closeModal}
                  className="flex-1 bg-[#1B1B1B] text-white py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-all">
                  Listo
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ── Modal variante rápida desde tabla ── */}
      {modalVariante && perfumeVariante && (
        <Modal title={`Nueva variante — ${perfumeVariante.nombre}`} onClose={() => setModalVariante(false)}>
          <form onSubmit={handleQuickVariante} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Tipo</label>
              <select value={quickVarianteForm.tipo} onChange={(e) => setQuickVarianteForm({ ...quickVarianteForm, tipo: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                <option>Completo</option>
                <option>Decant</option>
              </select>
            </div>
            {[
              { label: "Mililitros", key: "mililitros", step: "0.1" },
              { label: "Precio (₡)", key: "precio",     step: "1"   },
              { label: "Stock",      key: "stock",      step: "1"   },
            ].map(({ label, key, step }) => (
              <div key={key}>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">{label}</label>
                <input required type="number" step={step} min="0" value={quickVarianteForm[key]}
                  onChange={(e) => setQuickVarianteForm({ ...quickVarianteForm, [key]: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
              </div>
            ))}
            {errorQuick && <p className="text-xs text-red-500">{errorQuick}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalVariante(false)}
                className="flex-1 border border-[#EBEBEB] py-2.5 text-xs tracking-widest uppercase text-gray-500 hover:bg-gray-50 transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={savingQuick}
                className="flex-1 bg-[#1B1B1B] text-white py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50">
                {savingQuick ? "Guardando..." : "Guardar variante"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}