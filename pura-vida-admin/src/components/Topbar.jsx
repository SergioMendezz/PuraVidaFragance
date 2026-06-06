export default function Topbar({ title, subtitle, onMenuClick, actions }) {
  return (
    <header className="bg-white border-b border-[#EBEBEB] px-6 lg:px-8 py-5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-[#1B1B1B] hover:bg-gray-100 rounded"
          aria-label="Abrir menú"
        >
          <i className="ti ti-menu-2 text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-medium text-[#1B1B1B] tracking-wide">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5 tracking-wide">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}