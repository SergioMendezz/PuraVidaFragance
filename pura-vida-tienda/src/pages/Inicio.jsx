import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FloatingButtons from "../components/FloatingButtons";
import DiccionarioCarousel from "../components/DiccionarioCarousel";
import logo from "../assets/logo.png";

const categorias = [
  { to: "/perfumes",   label: "Perfumes",    sub: "Colección",            icon: "ti-droplet" },
  { to: "/bodys",      label: "Bodys",       sub: "Cuidado corporal",     icon: "ti-droplet-filled" },
  { to: "/bodysprays", label: "Body Sprays", sub: "Colección",            icon: "ti-wind" },
  { to: "/sets",       label: "Sets",        sub: "Regalos y colecciones",icon: "ti-gift" },
];

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <img src={logo} alt="Pura Vida Fragance" className="w-72 md:w-[420px] mb-8 object-contain" />
        <div className="w-12 h-px bg-[#1B1B1B] mb-6" />
        <p className="text-[11px] tracking-[4px] uppercase text-gray-500 mb-12">
          Fragancias selectas · Costa Rica
        </p>
        <button onClick={() => navigate("/perfumes")}
          className="flex flex-col items-center gap-2 text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors animate-bounce">
          <span>Ver catálogo</span>
          <i className="ti ti-chevron-down text-lg" />
        </button>
      </section>

      {/* Diccionario de la perfumería */}
      <DiccionarioCarousel />

      {/* Categorías */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="border-t border-[#EBEBEB] pt-16 mb-10">
          <p className="text-[10px] tracking-[5px] uppercase text-gray-500 mb-2">Tienda</p>
          <h2 className="text-4xl font-light text-[#1B1B1B] tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Categorías
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#EBEBEB]">
          {categorias.map(c => (
            <div key={c.to}
              onClick={() => navigate(c.to)}
              className="bg-white p-8 cursor-pointer hover:bg-[#FAFAFA] transition-colors group flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 border border-[#EBEBEB] flex items-center justify-center group-hover:border-[#1B1B1B] transition-colors">
                <i className={`ti ${c.icon} text-2xl text-[#999] group-hover:text-[#1B1B1B] transition-colors`} />
              </div>
              <div>
                <p className="text-[9px] tracking-[3px] uppercase text-gray-400 mb-1">{c.sub}</p>
                <p className="text-xl font-light text-[#1B1B1B]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {c.label}
                </p>
              </div>
              <span className="text-[10px] tracking-[2px] uppercase text-[#999] group-hover:text-[#1B1B1B] transition-colors mt-auto">
                Ver todo →
              </span>
            </div>
          ))}
        </div>
      </section>

      <FloatingButtons />
    </div>
  );
}