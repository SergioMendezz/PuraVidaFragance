import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import FloatingButtons from "../components/FloatingButtons";
import PerfumeModal from "../components/PerfumeModal";
import { getPerfumes, getMarcas } from "../services/api";

export default function Tienda() {
  const catalogoRef = useRef(null);
  const [perfumes, setPerfumes]       = useState([]);
  const [marcas, setMarcas]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [notaFiltro, setNotaFiltro]   = useState("");
  const [selected, setSelected]       = useState(null);

  useEffect(() => {
    Promise.all([getPerfumes(), getMarcas()])
      .then(([pRes, mRes]) => {
        setPerfumes(pRes.data ?? []);
        setMarcas(mRes.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scrollCatalogo = () => {
    catalogoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const todasNotas = [...new Map(
    perfumes.flatMap(p => p.notas ?? [])
      .map(n => [n.nombre, n])
  ).values()].sort((a, b) => b.intensidad - a.intensidad);

  const filtrados = perfumes
    .filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          p.marca?.toLowerCase().includes(search.toLowerCase());
      const matchMarca  = !marcaFiltro || p.marca === marcaFiltro;
      const matchNota   = !notaFiltro  || (p.notas ?? []).some(n => n.nombre === notaFiltro);
      return matchSearch && matchMarca && matchNota;
    })
    .sort((a, b) => {
      if (!notaFiltro) return 0;
      const intA = (a.notas ?? []).find(n => n.nombre === notaFiltro)?.intensidad ?? 0;
      const intB = (b.notas ?? []).find(n => n.nombre === notaFiltro)?.intensidad ?? 0;
      return intB - intA;
    });

  const getPrecioMin = (p) => {
    const variantes = p.variantes ?? [];
    if (!variantes.length) return null;
    return variantes.find(v => v.tipo === "Completo") ?? variantes[0];
  };

  const getNotasPrincipales = (p) => {
    return [...(p.notas ?? [])].sort((a, b) => b.intensidad - a.intensidad).slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar onScrollCatalogo={scrollCatalogo} />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-[10px] tracking-[6px] uppercase text-gray-500 mb-4">Fragance</p>
        <h1 className="text-7xl md:text-9xl font-semibold text-[#1B1B1B] tracking-widest leading-none mb-6">
          PURA<br/>VIDA
        </h1>
        <div className="w-12 h-px bg-[#1B1B1B] mb-6" />
        <p className="text-[11px] tracking-[4px] uppercase text-gray-500 mb-12">
          Fragancias selectas · Costa Rica
        </p>
        <button onClick={scrollCatalogo}
          className="flex flex-col items-center gap-2 text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors animate-bounce">
          <span>Ver catálogo</span>
          <i className="ti ti-chevron-down text-lg" aria-hidden="true" />
        </button>
      </section>

      {/* Catálogo */}
      <section ref={catalogoRef} className="max-w-6xl mx-auto px-6 pb-24">
        <div className="border-t border-[#EBEBEB] pt-16 mb-10">
          <p className="text-[10px] tracking-[5px] uppercase text-gray-500 mb-2">Colección</p>
          <h2 className="text-3xl font-light text-[#1B1B1B] tracking-wide">Catálogo</h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center gap-3 border border-[#D0D0D0] px-4 py-2.5 flex-1">
            <i className="ti ti-search text-gray-500 text-sm" aria-hidden="true" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar perfume..."
              className="flex-1 outline-none text-sm text-[#1B1B1B] placeholder-gray-400 font-sans bg-transparent" />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <i className="ti ti-x text-sm" />
              </button>
            )}
          </div>
          <select value={marcaFiltro} onChange={(e) => setMarcaFiltro(e.target.value)}
            className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] font-sans transition-colors">
            <option value="">Todas las marcas</option>
            {marcas.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
          </select>
          <select value={notaFiltro} onChange={(e) => setNotaFiltro(e.target.value)}
            className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] font-sans transition-colors">
            <option value="">Todas las notas</option>
            {todasNotas.map(n => <option key={n.nombre} value={n.nombre}>{n.nombre}</option>)}
          </select>
        </div>

        {/* Chips de notas */}
        {todasNotas.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            <button onClick={() => setNotaFiltro("")}
              className={`px-3 py-1.5 text-[10px] tracking-[2px] uppercase border transition-colors font-medium ${!notaFiltro ? "bg-[#1B1B1B] text-white border-[#1B1B1B]" : "border-[#C0C0C0] text-[#555] hover:border-[#1B1B1B] hover:text-[#1B1B1B]"}`}>
              Todas
            </button>
            {todasNotas.slice(0, 8).map(n => (
              <button key={n.nombre} onClick={() => setNotaFiltro(n.nombre === notaFiltro ? "" : n.nombre)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[2px] uppercase border transition-colors font-medium ${notaFiltro === n.nombre ? "bg-[#1B1B1B] text-white border-[#1B1B1B]" : "border-[#C0C0C0] text-[#555] hover:border-[#1B1B1B] hover:text-[#1B1B1B]"}`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: n.colorHex }} />
                {n.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white p-5 animate-pulse">
                <div className="h-48 bg-gray-100 mb-4" />
                <div className="h-3 bg-gray-100 w-1/3 mb-2" />
                <div className="h-4 bg-gray-100 w-2/3" />
              </div>
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-500 tracking-wide">No se encontraron perfumes</p>
            <button onClick={() => { setSearch(""); setMarcaFiltro(""); setNotaFiltro(""); }}
              className="mt-4 text-[11px] tracking-[2px] uppercase text-[#1B1B1B] underline">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
            {filtrados.map((p) => {
              const varPrincipal = getPrecioMin(p);
              const notas        = getNotasPrincipales(p);
              const tieneDecant  = (p.variantes ?? []).some(v => v.tipo === "Decant");

              return (
                <div key={p.id} className="bg-white p-5 cursor-pointer hover:bg-[#FAFAFA] transition-colors group"
                  onClick={() => setSelected(p)}>

                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[11px] tracking-[2px] uppercase text-[#666] font-medium">{p.genero}</span>
                    <div className="flex gap-1.5">
                      {notas.map(n => (
                        <div key={n.nombre} title={n.nombre}
                          className="w-3 h-3 rounded-full border border-white"
                          style={{ backgroundColor: n.colorHex }} />
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
                  <p className="text-sm font-medium text-[#1B1B1B] mb-3 leading-tight">{p.nombre}</p>

                  {varPrincipal && (
                    <p className="text-base font-light text-[#1B1B1B] mb-3">
                      ₡{Number(varPrincipal.precio).toLocaleString()}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[2px] uppercase text-[#666] group-hover:text-[#1B1B1B] transition-colors font-medium">
                      Ver detalles →
                    </span>
                    {tieneDecant && (
                      <span className="text-[9px] tracking-[1px] uppercase border border-[#C0C0C0] px-2 py-1 text-[#555] font-medium">
                        Decant disponible
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-[11px] tracking-[2px] uppercase text-[#666] mt-8">
          {filtrados.length} {filtrados.length === 1 ? "fragancia" : "fragancias"}
        </p>
      </section>

      <FloatingButtons />
      {selected && <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}