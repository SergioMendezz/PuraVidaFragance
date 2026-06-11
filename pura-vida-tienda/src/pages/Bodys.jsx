import { useEffect, useState } from "react";
import CatalogoPagina from "../components/CatalogoPagina";
import BodyModal from "../components/BodyModal";
import { getBodys } from "../services/api";

export default function Bodys() {
  const [bodys, setBodys]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getBodys()
      .then(r => setBodys(Array.isArray(r.data) ? r.data : []))
      .catch(() => setBodys([]))
      .finally(() => setLoading(false));
  }, []);

  const renderTarjeta = (b) => (
    <div key={b.id}
      className="bg-white p-5 cursor-pointer hover:bg-[#FAFAFA] transition-colors group"
      onClick={() => setSelected(b)}>
      {b.imagenUrl ? (
        <div className="h-48 mb-4 overflow-hidden">
          <img src={b.imagenUrl} alt={b.nombre}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-48 bg-[#F5F5F5] mb-4 flex items-center justify-center">
          <i className="ti ti-droplet-filled text-4xl text-[#D0D0D0]" />
        </div>
      )}
      {b.marca && <p className="text-[11px] tracking-[3px] uppercase text-[#666] mb-1">{b.marca}</p>}
      <p className="text-[10px] tracking-[2px] uppercase text-[#999] mb-1">{b.mililitros} ml</p>
      <p className="mb-3 leading-tight text-[#1B1B1B]"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 400 }}>
        {b.nombre}
      </p>
      <p className="text-base font-light text-[#1B1B1B] mb-3">₡{Number(b.precio).toLocaleString()}</p>
      <span className="text-[10px] tracking-[2px] uppercase text-[#666] group-hover:text-[#1B1B1B] transition-colors font-medium">
        Ver detalles →
      </span>
    </div>
  );

  return (
    <CatalogoPagina
      titulo="Bodys"
      subtitulo="Cuidado corporal"
      productos={bodys}
      loading={loading}
      renderTarjeta={renderTarjeta}
      renderModal={() => selected && <BodyModal body={selected} onClose={() => setSelected(null)} />}
    />
  );
}