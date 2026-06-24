import { useEffect } from "react";

const WA_NUMBER = "50670987605";

export default function SetModal({ set, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hola! Me interesa el set *${set.nombre}* por *₡${Number(set.precio).toLocaleString()}*. ¿Está disponible?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#EBEBEB]">
          <div>
            <p className="text-xs text-gray-400 mb-1">Set</p>
            <h2 className="text-2xl font-light text-[#1B1B1B] tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {set.nombre}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-[#1B1B1B] transition-colors p-1 mt-1" aria-label="Cerrar">
            <i className="ti ti-x text-xl" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {set.imagenUrl && (
            <div className="h-56 overflow-hidden">
              <img src={set.imagenUrl} alt={set.nombre}
                className="w-full h-full object-contain" />
            </div>
          )}

          {set.descripcion && (
            <p className="text-sm text-gray-500 leading-relaxed">{set.descripcion}</p>
          )}

          {set.items?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#1B1B1B] mb-3">Contenido del set</p>
              <div className="space-y-2">
                {set.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border border-[#EBEBEB] px-4 py-3">
                    <span className="text-[10px] tracking-[2px] uppercase text-gray-400 w-20 flex-shrink-0">
                      {item.tipoProducto}
                    </span>
                    <span className="text-sm text-[#1B1B1B] flex-1">
                      {item.nombreItem || item.nombreProducto || item.tipoProducto}
                    </span>
                    <span className="text-xs text-gray-400">x{item.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border border-[#EBEBEB] px-4 py-4">
            <p className="text-xl font-light text-[#1B1B1B]">₡{Number(set.precio).toLocaleString()}</p>
            <a href={waUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 bg-[#1B1B1B] text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-black transition-colors">
              <i className="ti ti-brand-whatsapp text-sm" /> Pedir
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}