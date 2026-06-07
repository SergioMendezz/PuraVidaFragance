import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import FloatingButtons from "../components/FloatingButtons";
import PerfumeModal from "../components/PerfumeModal";
import BodyModal from "../components/BodyModal";
import BodySprayModal from "../components/BodySprayModal";
import SetModal from "../components/SetModal";
import { getPerfumes, getMarcas, getBodys, getBodySprays, getSets } from "../services/api";
import logo from "../assets/logo.png";

export default function Tienda() {
  const catalogoRef   = useRef(null);
  const bodysRef      = useRef(null);
  const bodyspraysRef = useRef(null);
  const setsRef       = useRef(null);

  const [perfumes, setPerfumes] = useState([]);
  const [marcas, setMarcas]     = useState([]);
  const [bodys, setBodys]       = useState([]);
  const [sprays, setSprays]     = useState([]);
  const [sets, setSets]         = useState([]);
  const [loading, setLoading]   = useState(true);

  // Filtros perfumes
  const [search, setSearch]           = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [notaFiltro, setNotaFiltro]   = useState("");

  // Filtros bodys
  const [bodySearch, setBodySearch]         = useState("");
  const [bodyMarcaFiltro, setBodyMarcaFiltro] = useState("");

  // Filtros body sprays
  const [spraySearch, setSpraySearch]           = useState("");
  const [sprayMarcaFiltro, setSprayMarcaFiltro] = useState("");

  // Filtros sets
  const [setSearch, setSetSearch]         = useState("");
  const [setMarcaFiltro, setSetMarcaFiltro] = useState("");

  const [selectedPerfume,   setSelectedPerfume]   = useState(null);
  const [selectedBody,      setSelectedBody]      = useState(null);
  const [selectedBodySpray, setSelectedBodySpray] = useState(null);
  const [selectedSet,       setSelectedSet]       = useState(null);

  useEffect(() => {
    Promise.all([getPerfumes(), getMarcas(), getBodys(), getBodySprays(), getSets()])
      .then(([pRes, mRes, bRes, spRes, sRes]) => {
        setPerfumes(Array.isArray(pRes.data)  ? pRes.data  : []);
        setMarcas(Array.isArray(mRes.data)    ? mRes.data  : []);
        setBodys(Array.isArray(bRes.data)     ? bRes.data  : []);
        setSprays(Array.isArray(spRes.data)   ? spRes.data : []);
        setSets(Array.isArray(sRes.data)      ? sRes.data  : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  // Notas únicas para chips
  const todasNotas = [...new Map(
    perfumes.flatMap(p => Array.isArray(p.notas) ? p.notas : []).map(n => [n.nombre, n])
  ).values()].sort((a, b) => b.intensidad - a.intensidad);

  // Marcas únicas por sección
  const marcasBodys  = [...new Map(bodys.filter(b => b.marca).map(b => [b.idMarca, { id: b.idMarca, nombre: b.marca }])).values()];
  const marcasSprays = [...new Map(sprays.filter(s => s.marca).map(s => [s.idMarca, { id: s.idMarca, nombre: s.marca }])).values()];
  const marcasSets   = [...new Map(sets.filter(s => s.marca).map(s => [s.idMarca, { id: s.idMarca, nombre: s.marca }])).values()];

  // Filtrados
  const filtradosPerfumes = perfumes
    .filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca?.toLowerCase().includes(search.toLowerCase());
      const matchMarca  = !marcaFiltro || p.marca === marcaFiltro;
      const matchNota   = !notaFiltro  || (Array.isArray(p.notas) ? p.notas : []).some(n => n.nombre === notaFiltro);
      return matchSearch && matchMarca && matchNota;
    })
    .sort((a, b) => {
      if (!notaFiltro) return 0;
      const intA = (Array.isArray(a.notas) ? a.notas : []).find(n => n.nombre === notaFiltro)?.intensidad ?? 0;
      const intB = (Array.isArray(b.notas) ? b.notas : []).find(n => n.nombre === notaFiltro)?.intensidad ?? 0;
      return intB - intA;
    });

  const filtradosBodys  = bodys.filter(b =>
    b.nombre.toLowerCase().includes(bodySearch.toLowerCase()) &&
    (!bodyMarcaFiltro || b.marca === bodyMarcaFiltro)
  );

  const filtradosSprays = sprays.filter(s =>
    s.nombre.toLowerCase().includes(spraySearch.toLowerCase()) &&
    (!sprayMarcaFiltro || s.marca === sprayMarcaFiltro)
  );

  const filtradosSets = sets.filter(s =>
    s.nombre.toLowerCase().includes(setSearch.toLowerCase()) &&
    (!setMarcaFiltro || s.marca === setMarcaFiltro)
  );

  const getPrecioMin = (p) => {
    const v = Array.isArray(p.variantes) ? p.variantes : [];
    return v.find(x => x.tipo === "Completo") ?? v[0] ?? null;
  };

  const getNotasPrincipales = (p) =>
    [...(Array.isArray(p.notas) ? p.notas : [])].sort((a, b) => b.intensidad - a.intensidad).slice(0, 4);

  const sinStock = (p) => {
    const v = Array.isArray(p.variantes) ? p.variantes : [];
    return v.length > 0 && v.every(x => x.stock === 0);
  };

  // Header reutilizable
  const SeccionHeader = ({ titulo, subtitulo }) => (
    <div className="border-t border-[#EBEBEB] pt-16 mb-10">
      <p className="text-[10px] tracking-[5px] uppercase text-gray-500 mb-2">{subtitulo}</p>
      <h2 className="text-4xl font-light text-[#1B1B1B] tracking-wide"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {titulo}
      </h2>
    </div>
  );

  // Filtros reutilizables (búsqueda + marca)
  const FiltrosBuscadorMarca = ({ searchVal, onSearch, marcaVal, onMarca, marcasOpts, placeholder }) => (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="flex items-center gap-3 border border-[#D0D0D0] px-4 py-2.5 flex-1">
        <i className="ti ti-search text-gray-500 text-sm" />
        <input value={searchVal} onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-[#1B1B1B] placeholder-gray-400 bg-transparent" />
        {searchVal && (
          <button onClick={() => onSearch("")} className="text-gray-400 hover:text-gray-600">
            <i className="ti ti-x text-sm" />
          </button>
        )}
      </div>
      {marcasOpts.length > 0 && (
        <select value={marcaVal} onChange={(e) => onMarca(e.target.value)}
          className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] transition-colors">
          <option value="">Todas las marcas</option>
          {marcasOpts.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
        </select>
      )}
    </div>
  );

  // Tarjeta reutilizable para body, spray y set
  const TarjetaProducto = ({ item, subtitulo, onClick, placeholder }) => (
    <div className="bg-white p-5 cursor-pointer hover:bg-[#FAFAFA] transition-colors group" onClick={onClick}>
      {item.imagenUrl ? (
        <div className="h-48 mb-4 overflow-hidden">
          <img src={item.imagenUrl} alt={item.nombre}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-48 bg-[#F5F5F5] mb-4 flex items-center justify-center">
          <i className={`ti ${placeholder} text-4xl text-[#D0D0D0]`} />
        </div>
      )}
      {item.marca && (
        <p className="text-[11px] tracking-[3px] uppercase text-[#666] mb-1">{item.marca}</p>
      )}
      <p className="text-[10px] tracking-[2px] uppercase text-[#999] mb-1">{subtitulo}</p>
      <p className="mb-3 leading-tight text-[#1B1B1B]"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 400 }}>
        {item.nombre}
      </p>
      <p className="text-base font-light text-[#1B1B1B] mb-3">
        ₡{Number(item.precio).toLocaleString()}
      </p>
      <span className="text-[10px] tracking-[2px] uppercase text-[#666] group-hover:text-[#1B1B1B] transition-colors font-medium">
        Ver detalles →
      </span>
    </div>
  );

  // Grid vacío reutilizable
  const GridVacio = ({ mensaje, onLimpiar }) => (
    <div className="text-center py-20 bg-[#FAFAFA]">
      <p className="text-sm text-gray-500">{mensaje}</p>
      {onLimpiar && (
        <button onClick={onLimpiar} className="mt-4 text-[11px] tracking-[2px] uppercase text-[#1B1B1B] underline">
          Limpiar filtros
        </button>
      )}
    </div>
  );

  // Skeleton de carga
  const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white p-5 animate-pulse">
          <div className="h-48 bg-gray-100 mb-4" />
          <div className="h-3 bg-gray-100 w-1/3 mb-2" />
          <div className="h-4 bg-gray-100 w-2/3" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar
        onScrollCatalogo={() => scrollTo(catalogoRef)}
        onScrollBodys={() => scrollTo(bodysRef)}
        onScrollBodySprays={() => scrollTo(bodyspraysRef)}
        onScrollSets={() => scrollTo(setsRef)}
      />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <img src={logo} alt="Pura Vida Fragance" className="w-72 md:w-[420px] mb-8 object-contain" />
        <div className="w-12 h-px bg-[#1B1B1B] mb-6" />
        <p className="text-[11px] tracking-[4px] uppercase text-gray-500 mb-12">
          Fragancias selectas · Costa Rica
        </p>
        <button onClick={() => scrollTo(catalogoRef)}
          className="flex flex-col items-center gap-2 text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors animate-bounce">
          <span>Ver catálogo</span>
          <i className="ti ti-chevron-down text-lg" />
        </button>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24">

        {/* ── Perfumes ── */}
        <section ref={catalogoRef}>
          <SeccionHeader titulo="Perfumes" subtitulo="Colección" />

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex items-center gap-3 border border-[#D0D0D0] px-4 py-2.5 flex-1">
              <i className="ti ti-search text-gray-500 text-sm" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar perfume..."
                className="flex-1 outline-none text-sm text-[#1B1B1B] placeholder-gray-400 bg-transparent" />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                  <i className="ti ti-x text-sm" />
                </button>
              )}
            </div>
            <select value={marcaFiltro} onChange={(e) => setMarcaFiltro(e.target.value)}
              className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] transition-colors">
              <option value="">Todas las marcas</option>
              {marcas.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
            </select>
            <select value={notaFiltro} onChange={(e) => setNotaFiltro(e.target.value)}
              className="border border-[#D0D0D0] px-4 py-2.5 text-sm text-[#444] bg-white outline-none focus:border-[#1B1B1B] transition-colors">
              <option value="">Todas las notas</option>
              {todasNotas.map(n => <option key={n.nombre} value={n.nombre}>{n.nombre}</option>)}
            </select>
          </div>

          {todasNotas.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              <button onClick={() => setNotaFiltro("")}
                className={`px-3 py-1.5 text-[10px] tracking-[2px] uppercase border transition-colors font-medium ${!notaFiltro ? "bg-[#1B1B1B] text-white border-[#1B1B1B]" : "border-[#C0C0C0] text-[#555] hover:border-[#1B1B1B]"}`}>
                Todas
              </button>
              {todasNotas.slice(0, 8).map(n => (
                <button key={n.nombre} onClick={() => setNotaFiltro(n.nombre === notaFiltro ? "" : n.nombre)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[2px] uppercase border transition-colors font-medium ${notaFiltro === n.nombre ? "bg-[#1B1B1B] text-white border-[#1B1B1B]" : "border-[#C0C0C0] text-[#555] hover:border-[#1B1B1B]"}`}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: n.colorHex }} />
                  {n.nombre}
                </button>
              ))}
            </div>
          )}

          {loading ? <Skeleton /> : filtradosPerfumes.length === 0 ? (
            <GridVacio
              mensaje="No se encontraron perfumes"
              onLimpiar={() => { setSearch(""); setMarcaFiltro(""); setNotaFiltro(""); }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
              {filtradosPerfumes.map((p) => {
                const varPrincipal = getPrecioMin(p);
                const notas        = getNotasPrincipales(p);
                const tieneDecant  = (p.variantes ?? []).some(v => v.tipo === "Decant");
                const agotado      = sinStock(p);
                return (
                  <div key={p.id}
                    className={`bg-white p-5 relative transition-colors group ${agotado ? "opacity-70 cursor-default" : "cursor-pointer hover:bg-[#FAFAFA]"}`}
                    onClick={() => !agotado && setSelectedPerfume(p)}>
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
              })}
            </div>
          )}
          <p className="text-center text-[11px] tracking-[2px] uppercase text-[#666] mt-8">
            {filtradosPerfumes.length} {filtradosPerfumes.length === 1 ? "fragancia" : "fragancias"}
          </p>
        </section>

        {/* ── Bodys ── */}
        <section ref={bodysRef}>
          <SeccionHeader titulo="Bodys" subtitulo="Cuidado corporal" />
          <FiltrosBuscadorMarca
            searchVal={bodySearch} onSearch={setBodySearch}
            marcaVal={bodyMarcaFiltro} onMarca={setBodyMarcaFiltro}
            marcasOpts={marcasBodys} placeholder="Buscar body..."
          />
          {loading ? <Skeleton /> : filtradosBodys.length === 0 ? (
            <GridVacio
              mensaje={bodys.length === 0 ? "Próximamente" : "No se encontraron bodys"}
              onLimpiar={bodys.length > 0 ? () => { setBodySearch(""); setBodyMarcaFiltro(""); } : null}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
              {filtradosBodys.map(b => (
                <TarjetaProducto key={b.id} item={b}
                  subtitulo={`${b.mililitros} ml`}
                  placeholder="ti-droplet-filled"
                  onClick={() => setSelectedBody(b)} />
              ))}
            </div>
          )}
          <p className="text-center text-[11px] tracking-[2px] uppercase text-[#666] mt-8">
            {filtradosBodys.length} {filtradosBodys.length === 1 ? "producto" : "productos"}
          </p>
        </section>

        {/* ── Body Sprays ── */}
        <section ref={bodyspraysRef}>
          <SeccionHeader titulo="Body Sprays" subtitulo="Colección" />
          <FiltrosBuscadorMarca
            searchVal={spraySearch} onSearch={setSpraySearch}
            marcaVal={sprayMarcaFiltro} onMarca={setSprayMarcaFiltro}
            marcasOpts={marcasSprays} placeholder="Buscar body spray..."
          />
          {loading ? <Skeleton /> : filtradosSprays.length === 0 ? (
            <GridVacio
              mensaje={sprays.length === 0 ? "Próximamente" : "No se encontraron body sprays"}
              onLimpiar={sprays.length > 0 ? () => { setSpraySearch(""); setSprayMarcaFiltro(""); } : null}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
              {filtradosSprays.map(s => (
                <TarjetaProducto key={s.id} item={s}
                  subtitulo={s.nombrePerfumeBase ? `Basado en ${s.nombrePerfumeBase}` : `${s.mililitros} ml`}
                  placeholder="ti-wind"
                  onClick={() => setSelectedBodySpray(s)} />
              ))}
            </div>
          )}
          <p className="text-center text-[11px] tracking-[2px] uppercase text-[#666] mt-8">
            {filtradosSprays.length} {filtradosSprays.length === 1 ? "producto" : "productos"}
          </p>
        </section>

        {/* ── Sets ── */}
        <section ref={setsRef}>
          <SeccionHeader titulo="Sets" subtitulo="Regalos y colecciones" />
          <FiltrosBuscadorMarca
            searchVal={setSearch} onSearch={setSetSearch}
            marcaVal={setMarcaFiltro} onMarca={setSetMarcaFiltro}
            marcasOpts={marcasSets} placeholder="Buscar set..."
          />
          {loading ? <Skeleton /> : filtradosSets.length === 0 ? (
            <GridVacio
              mensaje={sets.length === 0 ? "Próximamente" : "No se encontraron sets"}
              onLimpiar={sets.length > 0 ? () => { setSetSearch(""); setSetMarcaFiltro(""); } : null}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EBEBEB]">
              {filtradosSets.map(s => (
                <TarjetaProducto key={s.id} item={s}
                  subtitulo={`${s.items?.length ?? 0} productos incluidos`}
                  placeholder="ti-gift"
                  onClick={() => setSelectedSet(s)} />
              ))}
            </div>
          )}
          <p className="text-center text-[11px] tracking-[2px] uppercase text-[#666] mt-8">
            {filtradosSets.length} {filtradosSets.length === 1 ? "set" : "sets"}
          </p>
        </section>

      </div>

      <FloatingButtons />
      {selectedPerfume   && <PerfumeModal   perfume={selectedPerfume}      onClose={() => setSelectedPerfume(null)} />}
      {selectedBody      && <BodyModal      body={selectedBody}            onClose={() => setSelectedBody(null)} />}
      {selectedBodySpray && <BodySprayModal spray={selectedBodySpray}      onClose={() => setSelectedBodySpray(null)} />}
      {selectedSet       && <SetModal       set={selectedSet}              onClose={() => setSelectedSet(null)} />}
    </div>

    
  );
}