import { useEffect, useState } from "react";
import CatalogoPagina from "../components/CatalogoPagina";
import BodySprayModal from "../components/BodySprayModal";
import { getBodySprays } from "../services/api";

export default function BodySprays() {
  const [sprays, setSprays]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getBodySprays()
      .then(r => setSprays(Array.isArray(r.data) ? r.data : []))
      .catch(() => setSprays([]))
      .finally(() => setLoading(false));
  }, []);

  const renderTarjeta = (s) => (
    <div key={s.id}
      className="bg-white p-5 cursor-pointer hover:bg-[#FAFAFA] transition-colors group"
      onClick={() => setSelected(s)}>
      {s.imagenUrl ? (
        <div className="h-48 mb-4 overflow-hidden">
          <img src={s.imagenUrl} alt={s.nombre}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-48 bg-[#F5F5F5] mb-4 flex items-center justify-center">
          <i className="ti ti-wind text-4xl text-[#D0D0D0]" />
        </div>
      )}
      {s.marca && <p className="text-[11px] tracking-[3px] uppercase text-[#666] mb-1">{s.marca}</p>}
      <p className="text-[10px] tracking-[2px] uppercase text-[#999] mb-1">
        {s.nombrePerfumeBase ? `Basado en ${s.nombrePerfumeBase}` : `${s.mililitros} ml`}
      </p>
      <p className="mb-3 leading-tight text-[#1B1B1B]"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 400 }}>
        {s.nombre}
      </p>
      <p className="text-base font-light text-[#1B1B1B] mb-3">₡{Number(s.precio).toLocaleString()}</p>
      <span className="text-[10px] tracking-[2px] uppercase text-[#666] group-hover:text-[#1B1B1B] transition-colors font-medium">
        Ver detalles →
      </span>
    </div>
  );

  return (
    <CatalogoPagina
      titulo="Body Sprays"
      subtitulo="Colección"
      productos={sprays}
      loading={loading}
      renderTarjeta={renderTarjeta}
      renderModal={() => selected && <BodySprayModal spray={selected} onClose={() => setSelected(null)} />}
    />
  );
}