import { useEffect, useState } from "react";
import { useState as useModalState } from "react";
import CatalogoPagina from "../components/CatalogoPagina";
import PerfumeModal from "../components/PerfumeModal";
import { getPerfumes } from "../services/api";

export default function Perfumes() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getPerfumes()
      .then(r => setPerfumes(Array.isArray(r.data) ? r.data.filter(p => p.activo) : []))
      .catch(() => setPerfumes([]))
      .finally(() => setLoading(false));
  }, []);

  const sinStock = (p) => {
    const v = Array.isArray(p.variantes) ? p.variantes : [];
    return v.length > 0 && v.every(x => x.stock === 0);
  };

  const getPrecioMin = (p) => {
    const v = Array.isArray(p.variantes) ? p.variantes : [];
    return v.find(x => x.tipo === "Completo") ?? v[0] ?? null;
  };

  const getNotasPrincipales = (p) =>
    [...(Array.isArray(p.notas) ? p.notas : [])].sort((a, b) => b.intensidad - a.intensidad).slice(0, 4);

  // Para el filtro de precio usamos el precio de la variante principal.
  // notasPrincipales y tieneDecant alimentan los filtros de "notas aromáticas" y "decant disponible".
  const perfumesConPrecio = perfumes.map(p => ({
    ...p,
    precio: getPrecioMin(p)?.precio ?? 0,
    notasPrincipales: getNotasPrincipales(p).map(n => n.nombre),
    tieneDecant: (p.variantes ?? []).some(v => v.tipo === "Decant"),
  }));

  const renderTarjeta = (p) => {
    const varPrincipal = getPrecioMin(p);
    const notas = getNotasPrincipales(p);
    const tieneDecant = p.tieneDecant;
    const agotado = sinStock(p);

    return (
      <div key={p.id}
        className={`bg-white p-5 relative transition-colors group ${agotado ? "opacity-70 cursor-default" : "cursor-pointer hover:bg-[#FAFAFA]"}`}
        onClick={() => !agotado && setSelected(p)}>
        {agotado && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-[#1B1B1B]/80 text-white text-[9px] tracking-widest uppercase text-center py-1.5">
            Sin stock temporalmente
          </div>
        )}
        <div className="flex items-start justify-between mb-4">
          <span className="text-[11px] tracking-[2px] uppercase text-[#666] font-medium">{p.genero}</span>
          <div className="flex gap-1.5">
            {notas.map(n => (
              <div key={n.nombre} title={n.nombre} className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: n.colorHex }} />
            ))}
          </div>
        </div>
        {p.imagenUrl ? (
          <div className="h-48 mb-4 overflow-hidden">
            <img src={p.imagenUrl} alt={p.nombre}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
          </div>
        ) : (
          <div className="h-48 bg-[#F5F5F5] mb-4 flex items-center justify-center">
            <div className="relative">
              <div className="w-8 h-16 bg-[#1B1B1B] rounded-sm rounded-b-2xl" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1B1B1B] rounded-sm" />
            </div>
          </div>
        )}
        <p className="text-[11px] tracking-[3px] uppercase text-[#666] mb-1">{p.marca}</p>
        <p className="mb-3 leading-tight text-[#1B1B1B]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 400 }}>
          {p.nombre}
        </p>
        {varPrincipal && !agotado && (
          <p className="text-base font-light text-[#1B1B1B] mb-3">₡{Number(varPrincipal.precio).toLocaleString()}</p>
        )}
        <div className="flex items-center justify-between">
          {!agotado && (
            <span className="text-[10px] tracking-[2px] uppercase text-[#666] group-hover:text-[#1B1B1B] transition-colors font-medium">
              Ver detalles →
            </span>
          )}
          {tieneDecant && !agotado && (
            <span className="text-[9px] tracking-[1px] uppercase border border-[#C0C0C0] px-2 py-1 text-[#555] font-medium">
              Decant disponible
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <CatalogoPagina
      titulo="Perfumes"
      subtitulo="Colección"
      productos={perfumesConPrecio}
      loading={loading}
      conFiltroGenero={true}
      conFiltroNotas={true}
      conFiltroDecant={true}
      renderTarjeta={renderTarjeta}
      renderModal={() => selected && <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />}
    />
  );
}