import { useState } from "react";

export default function Navbar({ onScrollCatalogo, onScrollBodys, onScrollBodySprays, onScrollSets }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EBEBEB]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[8px] tracking-[4px] text-gray-400 uppercase">Fragance</p>
          <p className="text-lg font-semibold text-[#1B1B1B] tracking-widest leading-tight">PURA VIDA</p>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={onScrollCatalogo} className="text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors">
            Perfumes
          </button>
          <button onClick={onScrollBodys} className="text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors">
            Bodys
          </button>
          <button onClick={onScrollBodySprays} className="text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors">
            Body Sprays
          </button>
          <button onClick={onScrollSets} className="text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors">
            Sets
          </button>
          <a href="https://wa.me/50670987605" target="_blank" rel="noreferrer"
            className="text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors">
            WhatsApp
          </a>
          <a href="https://instagram.com/pura_vida_fragance" target="_blank" rel="noreferrer"
            className="text-[10px] tracking-[3px] uppercase text-gray-500 hover:text-[#1B1B1B] transition-colors">
            Instagram
          </a>
        </div>

        <button className="md:hidden text-[#1B1B1B]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <i className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"} text-xl`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#EBEBEB] bg-white px-6 py-4 flex flex-col gap-4">
          <button onClick={() => { onScrollCatalogo(); setMenuOpen(false); }}
            className="text-[10px] tracking-[3px] uppercase text-gray-500 text-left">Perfumes</button>
          <button onClick={() => { onScrollBodys(); setMenuOpen(false); }}
            className="text-[10px] tracking-[3px] uppercase text-gray-500 text-left">Bodys</button>
          <button onClick={() => { onScrollBodySprays(); setMenuOpen(false); }}
            className="text-[10px] tracking-[3px] uppercase text-gray-500 text-left">Body Sprays</button>
          <button onClick={() => { onScrollSets(); setMenuOpen(false); }}
            className="text-[10px] tracking-[3px] uppercase text-gray-500 text-left">Sets</button>
          <a href="https://wa.me/50670987605" target="_blank" rel="noreferrer"
            className="text-[10px] tracking-[3px] uppercase text-gray-500">WhatsApp</a>
          <a href="https://instagram.com/pura_vida_fragance" target="_blank" rel="noreferrer"
            className="text-[10px] tracking-[3px] uppercase text-gray-500">Instagram</a>
        </div>
      )}
    </nav>
  );
}