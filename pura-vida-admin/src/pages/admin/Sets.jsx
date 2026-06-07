import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getSets, postSet, putSet, deleteSet, getPerfumes, getBodys, getBodySprays, getMarcas } from "../../services/api";

const emptySet  = { nombre: "", idMarca: "", precio: "", descripcion: "", imagenUrl: "" };
const emptyItem = { tipoProducto: "Perfume", idProducto: "", nombreItem: "", cantidad: 1, descripcion: "" };

export default function Sets() {
  const { onMenuClick } = useOutletContext();
  const [sets, setSets]         = useState([]);
  const [perfumes, setPerfumes] = useState([]);
  const [bodys, setBodys]       = useState([]);
  const [sprays, setSprays]     = useState([]);
  const [marcas, setMarcas]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [confirm, setConfirm]   = useState(null);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptySet);
  const [items, setItems]       = useState([]);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const load = async () => {
    try {
      const [sRes, pRes, bRes, spRes, mRes] = await Promise.all([
        getSets(), getPerfumes(), getBodys(), getBodySprays(), getMarcas()
      ]);
      setSets(Array.isArray(sRes.data)  ? sRes.data  : []);
      setPerfumes(Array.isArray(pRes.data) ? pRes.data : []);
      setBodys(Array.isArray(bRes.data)    ? bRes.data : []);
      setSprays(Array.isArray(spRes.data)  ? spRes.data : []);
      setMarcas(Array.isArray(mRes.data)   ? mRes.data : []);
    } catch { setSets([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null); setForm(emptySet); setItems([]); setError(""); setModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ nombre: s.nombre, idMarca: s.idMarca ?? "", precio: s.precio, descripcion: s.descripcion ?? "", imagenUrl: s.imagenUrl ?? "" });
    setItems(s.items?.map(i => ({
      tipoProducto: i.tipoProducto,
      idProducto:   i.idProducto ?? "",
      nombreItem:   i.nombreItem ?? "",
      cantidad:     i.cantidad,
      descripcion:  i.descripcion ?? "",
    })) ?? []);
    setError(""); setModal(true);
  };

  const closeModal = () => { setModal(false); setEditing(null); setItems([]); };

  const opcionesPorTipo = (tipo) => {
    if (tipo === "Perfume")   return perfumes;
    if (tipo === "Body")      return bodys;
    if (tipo === "BodySpray") return sprays;
    return [];
  };

  const addItem    = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    if (key === "tipoProducto") next[i].idProducto = "";
    setItems(next);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = {
        ...form,
        idMarca: form.idMarca || null,
        precio:  parseFloat(form.precio),
        items:   items.map(it => ({
          tipoProducto: it.tipoProducto,
          idProducto:   it.idProducto || null,
          nombreItem:   it.nombreItem || null,
          cantidad:     parseInt(it.cantidad),
          descripcion:  it.descripcion || null,
        })),
      };
      if (editing) await putSet(editing.id, payload);
      else         await postSet(payload);
      closeModal(); await load();
    } catch (err) {
      setError(err.response?.data ?? "Error al guardar");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteSet(id); await load(); }
    catch { } finally { setConfirm(null); }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Sets"
        subtitle="Gestión de sets y regalos"
        onMenuClick={onMenuClick}
        actions={
          <button onClick={openNew} className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
            <i className="ti ti-plus text-sm" /> Nuevo set
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loading ? (
          <p className="text-sm text-gray-400 tracking-wide">Cargando...</p>
        ) : (
          <div className="bg-white border border-[#EBEBEB]">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <span className="text-[10px] tracking-[3px] uppercase font-medium text-[#1B1B1B]">Sets registrados</span>
              <span className="text-xs text-gray-400">{sets.length} sets</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    {["Nombre", "Marca", "Precio", "Items", "Descripción", "Acciones"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sets.map((s) => (
                    <tr key={s.id} className="border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3.5 text-sm font-medium text-[#1B1B1B]">{s.nombre}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{s.marca ?? "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">₡{Number(s.precio).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block bg-[#F0F0F0] text-gray-500 px-2.5 py-1 text-[10px] tracking-widest uppercase">
                          {s.items?.length ?? 0} items
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 max-w-xs truncate">{s.descripcion ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(s)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-[#1B1B1B] hover:bg-gray-50 transition-all">
                            <i className="ti ti-edit text-sm" />
                          </button>
                          <button onClick={() => setConfirm(s.id)} className="border border-[#EBEBEB] p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sets.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No hay sets registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modal && (
        <Modal title={editing ? "Editar set" : "Nuevo set"} onClose={closeModal}>
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
                {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Precio (₡)</label>
                <input required type="number" min="0" step="1" value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">URL de imagen</label>
                <input value={form.imagenUrl} onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                  className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase text-gray-400 mb-1.5">Descripción</label>
              <textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="w-full border border-[#EBEBEB] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors resize-none" />
            </div>

            <div className="border-t border-[#EBEBEB] pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[2px] uppercase text-gray-400">Contenido del set</p>
                <button type="button" onClick={addItem}
                  className="flex items-center gap-1 border border-[#EBEBEB] px-3 py-1.5 text-[10px] tracking-widest uppercase text-gray-500 hover:bg-gray-50 transition-all">
                  <i className="ti ti-plus text-xs" /> Agregar item
                </button>
              </div>
              {items.length === 0 && (
                <p className="text-xs text-gray-400 py-2">Sin items. Agrega al menos uno.</p>
              )}
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="bg-[#FAFAFA] border border-[#F0F0F0] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-[2px] uppercase text-gray-400">Item {i + 1}</span>
                      <button type="button" onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <i className="ti ti-x text-sm" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] tracking-[2px] uppercase text-gray-400 mb-1">Tipo</label>
                        <select value={item.tipoProducto} onChange={(e) => updateItem(i, "tipoProducto", e.target.value)}
                          className="w-full border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                          {["Perfume", "Body", "BodySpray", "Extra"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] tracking-[2px] uppercase text-gray-400 mb-1">Cantidad</label>
                        <input type="number" min="1" value={item.cantidad}
                          onChange={(e) => updateItem(i, "cantidad", e.target.value)}
                          className="w-full border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
                      </div>
                    </div>
                    {item.tipoProducto !== "Extra" ? (
                      <div>
                        <label className="block text-[9px] tracking-[2px] uppercase text-gray-400 mb-1">Producto</label>
                        <select value={item.idProducto} onChange={(e) => updateItem(i, "idProducto", e.target.value)}
                          className="w-full border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors bg-white">
                          <option value="">Seleccionar...</option>
                          {opcionesPorTipo(item.tipoProducto).map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[9px] tracking-[2px] uppercase text-gray-400 mb-1">Nombre del extra</label>
                        <input value={item.nombreItem} onChange={(e) => updateItem(i, "nombreItem", e.target.value)}
                          placeholder="Ej: Estuche de cuero, Tarjeta de regalo..."
                          className="w-full border border-[#EBEBEB] px-2 py-2 text-sm focus:outline-none focus:border-[#1B1B1B] transition-colors" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
          message="¿Eliminar este set? Se eliminarán también todos sus items."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}