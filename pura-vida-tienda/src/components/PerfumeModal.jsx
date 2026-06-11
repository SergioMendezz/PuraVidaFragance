import { useEffect } from "react";

const WA_NUMBER = "50670987605";

function buildWaUrl(perfume, variante) {
  const tipo = variante.tipo === "Completo" ? "frasco completo" : "decant";
  const msg  = `Hola! Me interesa el *${perfume.nombre}* de *${variante.mililitros}ml* (${tipo}) por *₡${Number(variante.precio).toLocaleString()}*. ¿Está disponible?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function PerfumeModal({ perfume, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  const completos      = perfume.variantes?.filter(v => v.tipo === "Completo") ?? [];
  const decants        = perfume.variantes?.filter(v => v.tipo === "Decant")   ?? [];
  const notasOrdenadas = [...(perfume.notas ?? [])].sort((a, b) => b.intensidad - a.intensidad);
  const maxIntensidad  = notasOrdenadas.length > 0 ? notasOrdenadas[0].intensidad : 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#EBEBEB]">
          <div>
            <p className="text-xs text-gray-400 mb-1">{perfume.marca}</p>
            <h2 className="text-2xl font-light text-[#1B1B1B] tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {perfume.nombre}
            </h2>
            <span className="inline-block mt-2 text-xs border border-[#EBEBEB] px-3 py-1 text-gray-500">
              {perfume.genero}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-[#1B1B1B] transition-colors p-1 mt-1" aria-label="Cerrar">
            <i className="ti ti-x text-xl" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Descripción */}
          {perfume.descripcion && (
            <p className="text-sm text-gray-500 leading-relaxed">{perfume.descripcion}</p>
          )}

          {/* Notas aromáticas — escala relativa al máximo */}
          {notasOrdenadas.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#1B1B1B] mb-3">Notas aromáticas</p>
              <div className="space-y-2.5">
                {notasOrdenadas.map((n) => {
                  const pct = Math.round((n.intensidad / maxIntensidad) * 100);
                  return (
                    <div key={n.nombre} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 border border-white/50"
                        style={{ backgroundColor: n.colorHex }} />
                      <span className="text-sm text-gray-600 w-24 flex-shrink-0">{n.nombre}</span>
                      <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: n.colorHex }} />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right flex-shrink-0">
                        {n.intensidad}/10
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-[#F0F0F0]">
                <span className="text-[10px] text-gray-400">menos presente</span>
                <span className="text-[10px] text-gray-400">más presente</span>
              </div>
            </div>
          )}

          {/* Frasco completo */}
          {completos.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#1B1B1B] mb-3">Frasco completo</p>
              <div className="space-y-2">
                {completos.map((v) => (
                  <div key={v.id} className="flex items-center justify-between border border-[#EBEBEB] px-4 py-3 hover:border-[#1B1B1B] transition-colors">
                    <p className="text-sm font-medium text-[#1B1B1B]">{v.mililitros}ml</p>
                    <div className="flex items-center gap-4">
                      <p className="text-base font-medium text-[#1B1B1B]">₡{Number(v.precio).toLocaleString()}</p>
                      <a href={buildWaUrl(perfume, v)} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 bg-[#1B1B1B] text-white px-4 py-2 text-xs tracking-widest uppercase hover:bg-black transition-colors">
                        <i className="ti ti-brand-whatsapp text-sm" /> Pedir
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decants */}
          {decants.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-medium text-[#1B1B1B]">Decants</p>
                <span className="text-xs text-gray-400">— muestras para probar</span>
              </div>
              <div className="space-y-2">
                {decants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between border border-[#EBEBEB] px-4 py-3 hover:border-[#1B1B1B] transition-colors">
                    <p className="text-sm font-medium text-[#1B1B1B]">{v.mililitros}ml</p>
                    <div className="flex items-center gap-4">
                      <p className="text-base font-medium text-[#1B1B1B]">₡{Number(v.precio).toLocaleString()}</p>
                      <a href={buildWaUrl(perfume, v)} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 border border-[#1B1B1B] text-[#1B1B1B] px-4 py-2 text-xs tracking-widest uppercase hover:bg-[#1B1B1B] hover:text-white transition-colors">
                        <i className="ti ti-brand-whatsapp text-sm" /> Pedir decant
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completos.length === 0 && decants.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400 mb-3">Consultar disponibilidad</p>
              <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa el *${perfume.nombre}*. ¿Está disponible?`)}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#1B1B1B] text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
                <i className="ti ti-brand-whatsapp text-sm" /> Consultar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}