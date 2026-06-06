import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { section: "Catálogo", items: [
    { to: "/admin/perfumes", icon: "ti-droplet",  label: "Perfumes"  },
    { to: "/admin/marcas",   icon: "ti-tag",       label: "Marcas"    },
    { to: "/admin/notas",    icon: "ti-leaf",      label: "Notas"     },
  ]},
  { section: "Inventario", items: [
    { to: "/admin/variantes", icon: "ti-box", label: "Variantes" },
  ]},
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.nombreUsuario?.slice(0, 2).toUpperCase() ?? "AD";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-[#1B1B1B] z-30 flex flex-col
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        <div className="px-6 py-8 border-b border-white/10">
          <p className="text-[9px] tracking-[4px] text-white/40 uppercase mb-1">Fragance</p>
          <p className="text-2xl font-semibold text-white tracking-wide leading-tight">
            PURA<br/>VIDA
          </p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ section, items }) => (
            <div key={section}>
              <p className="px-6 pt-4 pb-1 text-[9px] tracking-[3px] text-white/60 uppercase">
                {section}
              </p>
              {items.map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-6 py-2.5 text-[13px] transition-all
                    border-l-2
                    ${isActive
                      ? "text-white border-white bg-white/10"
                      : "text-white/70 border-transparent hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <i className={`ti ${icon} text-base`} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] text-white font-medium flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-[12px] text-white/90">{user?.nombreUsuario}</p>
              <p className="text-[10px] text-white/50">Administrador</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <i className="ti ti-logout text-sm" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}