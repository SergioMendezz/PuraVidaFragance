import { useState, useMemo, useEffect } from "react";
import Navbar from "./Navbar";
import FloatingButtons from "./FloatingButtons";

const TAMANO_PAGINA = 30;

export default function CatalogoPagina({
  titulo, subtitulo, productos, loading, renderModal, renderTarjeta,
  conFiltroGenero = false,
  conFiltroNotas = false, campoNotas = "notasPrincipales",
  conFiltroDecant = false, campoDecant = "tieneDecant",
}) {
  const [search, setSearch]         = useState("");
  const [marcaFiltro, setMarca]     = useState("");
  const [generoFiltro, setGenero]   = useState("");
  const [precioMax, setPrecioMax]   = useState("");
  const [notaFiltro, setNota]       = useState("");
  const [soloDecant, setSoloDecant] = useState(false);
  const [visibles, setVisibles]     = useState(TAMANO_PAGINA);

  // Cada vez que cambian los filtros/búsqueda o llega un nuevo set de productos,
  // volvemos a mostrar solo la primera página para no renderizar todo de golpe.
  useEffect(() => {
    setVisibles(TAMANO_PAGINA);
  }, [search, marcaFiltro, generoFiltro, precioMax, notaFiltro, soloDecant, productos.length]);

  const marcas = useMemo(() =>
    [...new Map(productos.filter(p => p.marca).map(p => [p.marca, p.marca])).values()].sort(),
    [productos]
  );

  const notas = useMemo(() => {
    if (!conFiltroNotas) return [];
    const set = new Set();
    productos.forEach(p => (p[campoNotas] ?? []).forEach(n => set.add(n)));
    return [...set].sort();
  }, [productos, conFiltroNotas, campoNotas]);

  const maxPrecio = useMemo(() =>
    productos.length > 0 ? Math.max(...productos.map(p => Number(p.precio))) : 0,
    [productos]
  );

  const filtrados = useMemo(() =>
    productos.filter(p => {
      const matchSearch  = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                           (p.marca ?? "").toLowerCase().includes(search.toLowerCase());
      const matchMarca   = !marcaFiltro  || p.marca === marcaFiltro;
      const matchGenero  = !generoFiltro || p.genero === generoFiltro;
      const matchPrecio  = !precioMax    || Number(p.precio) <= Number(precioMax);
      const matchNota    = !notaFiltro   || (p[campoNotas] ?? []).includes(notaFiltro);
      const matchDecant  = !soloDecant   || p[campoDecant] === true;
      return matchSearch && matchMarca && matchGenero && matchPrecio && matchNota && matchDecant;
    }),
    [productos, search, marcaFiltro, generoFiltro, precioMax, notaFiltro, soloDecant, campoNotas, campoDecant]
  );

  // Solo se agrupa (y por lo tanto solo se renderiza) la porción visible según la paginación.
  const paginados = useMemo(() => filtrados.slice(0, visibles), [filtrados, visibles]);
  const hayMas = visibles < filtrados.length;

  const grupos = useMemo(() => {
    const sinMarca = paginados.filter(p => !p.marca);
    const conMarca = paginados.filter(p => p.marca);
    const map = new Map();
    conMarca.forEach(p => {
      if (!map.has(p.marca)) map.set(p.marca, []);
      map.get(p.marca).push(p);
    });
    const result = [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([marca, items]) => ({ marca, items }));
    if (sinMarca.length > 0) result.push({ marca: null, items: sinMarca });
    return result;
  }, [paginados]);

  const hayFiltros = search || marcaFiltro || generoFiltro || precioMax || notaFiltro || soloDecant;

  const limpiar = () => { setSearch(""); setMarca(""); setGenero(""); setPrecioMax(""); setNota(""); setSoloDecant(false); };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">

        {/* Header */}
        <div className="border-b border-[#EBEBEB] pb-10 mb-10">
          <p className="text-[10px] tracking-[5px] uppercase text-gray-500 mb-2">{subtitulo}</p>
          <div className="flex items-end justify-between">
            <h1 className="text-5xl font-light text-[#1B1B1B] tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {titulo}
            </h1>
            <span className="text-xs text-gray-400 mb-1">{filtrados.length} productos</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3 border border-[#D0D0D0] px-4 py-2.5 flex-1 min-w-[200px]">
            <i className="ti ti-search text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Buscar en ${titulo.toLowerCase()}...`}
              className="flex-1 outline-none text-sm text-[#1B1B1B] placeholder-gray-400 bg-transparent" />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <i className="ti ti-x text-sm" />
              </button>
            )}
          </div>

          {marcas.length > 0 && (
            <select value={marcaFiltro} onChange={e => setMarca(e.target.value)}
              className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] transition-colors">
              <option value="">Todas las marcas</option>
              {marcas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          )}

          {conFiltroNotas && notas.length > 0 && (
            <select value={notaFiltro} onChange={e => setNota(e.target.value)}
              className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] transition-colors">
              <option value="">Todas las notas</option>
              {notas.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          )}

          {conFiltroGenero && (
            <select value={generoFiltro} onChange={e => setGenero(e.target.value)}
              className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] transition-colors">
              <option value="">Todos los géneros</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Unisex">Unisex</option>
            </select>
          )}

          {maxPrecio > 0 && (
            <div className="flex items-center gap-3 border border-[#D0D0D0] px-4 py-2.5 min-w-[200px]">
              <i className="ti ti-currency-dollar text-gray-400 text-sm" />
              <div className="flex-1">
                <input type="range" min="0" max={maxPrecio} step="500"
                  value={precioMax || maxPrecio}
                  onChange={e => setPrecioMax(e.target.value === String(maxPrecio) ? "" : e.target.value)}
                  className="w-full accent-[#1B1B1B]" />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {precioMax ? `Hasta ₡${Number(precioMax).toLocaleString()}` : "Cualquier precio"}
                </p>
              </div>
            </div>
          )}

          {hayFiltros && (
            <button onClick={limpiar}
              className="border border-[#D0D0D0] px-4 py-2.5 text-[10px] tracking-[2px] uppercase text-gray-500 hover:border-[#1B1B1B] hover:text-[#1B1B1B] transition-colors whitespace-nowrap">
              Limpiar
            </button>
          )}
        </div>

        {/* Chips género + decant */}
        {(conFiltroGenero || conFiltroDecant) && (
          <div className="space-y-3 mb-10">
            {conFiltroGenero && (
              <div className="flex gap-2 flex-wrap">
                {["", "Hombre", "Mujer", "Unisex"].map((g) => (
                  <button key={g} onClick={() => setGenero(g)}
                    className={`px-3 py-1.5 text-[10px] tracking-[2px] uppercase border transition-colors font-medium ${generoFiltro === g ? "bg-[#1B1B1B] text-white border-[#1B1B1B]" : "border-[#C0C0C0] text-[#555] hover:border-[#1B1B1B]"}`}>
                    {g === "" ? "Todos" : g}
                  </button>
                ))}
              </div>
            )}

            {conFiltroDecant && (
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setSoloDecant(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[2px] uppercase border transition-colors font-medium ${soloDecant ? "bg-[#1B1B1B] text-white border-[#1B1B1B]" : "border-[#C0C0C0] text-[#555] hover:border-[#1B1B1B]"}`}>
                  <i className="ti ti-flask text-xs" />
                  Con decant disponible
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contenido */}
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
          <div className="text-center py-24 bg-[#FAFAFA]">
            <p className="text-sm text-gray-500 mb-4">
              {productos.length === 0 ? "Próximamente" : "No se encontraron productos"}
            </p>
            {hayFiltros && (
              <button onClick={limpiar} className="text-[11px] tracking-[2px] uppercase text-[#1B1B1B] underline">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {grupos.map(({ marca, items }) => (
              <div key={marca ?? "__sinmarca__"}>
                {marca && (
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-[10px] tracking-[4px] uppercase text-gray-400 font-medium">{marca}</h3>
                    <div className="flex-1 h-px bg-[#EBEBEB]" />
                    <span className="text-[10px] text-gray-400">{items.length}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
                  {items.map(p => renderTarjeta(p))}
                </div>
              </div>
            ))}

            {hayMas && (
              <div className="flex flex-col items-center gap-3 pt-4">
                <p className="text-[11px] text-gray-400">
                  Mostrando {paginados.length} de {filtrados.length} productos
                </p>
                <button onClick={() => setVisibles(v => v + TAMANO_PAGINA)}
                  className="border border-[#D0D0D0] px-8 py-3 text-[10px] tracking-[3px] uppercase text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-white hover:border-[#1B1B1B] transition-colors">
                  Cargar más
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <FloatingButtons />
      {renderModal()}
    </div>
  );
}