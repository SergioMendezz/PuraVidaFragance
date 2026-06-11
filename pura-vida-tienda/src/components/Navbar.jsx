import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/perfumes",   label: "Perfumes"    },
  { to: "/bodys",      label: "Bodys"       },
  { to: "/bodysprays", label: "Body Sprays" },
  { to: "/sets",       label: "Sets"        },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EBEBEB]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-left">
          <p className="text-[8px] tracking-[4px] text-gray-400 uppercase">Fragance</p>
          <p className="text-lg font-semibold text-[#1B1B1B] tracking-widest leading-tight">PURA VIDA</p>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `text-[10px] tracking-[3px] uppercase transition-colors ${isActive ? "text-[#1B1B1B] border-b border-[#1B1B1B] pb-0.5" : "text-gray-500 hover:text-[#1B1B1B]"}`
              }>
              {l.label}
            </NavLink>
          ))}
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
          {links.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-[10px] tracking-[3px] uppercase text-left ${isActive ? "text-[#1B1B1B]" : "text-gray-500"}`
              }>
              {l.label}
            </NavLink>
          ))}
          <a href="https://wa.me/50670987605" target="_blank" rel="noreferrer"
            className="text-[10px] tracking-[3px] uppercase text-gray-500">WhatsApp</a>
          <a href="https://instagram.com/pura_vida_fragance" target="_blank" rel="noreferrer"
            className="text-[10px] tracking-[3px] uppercase text-gray-500">Instagram</a>
        </div>
      )}
    </nav>
  );
}