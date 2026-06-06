export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
          <h2 className="text-sm font-medium tracking-widest uppercase text-[#1B1B1B]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1B1B1B] transition-colors"
            aria-label="Cerrar"
          >
            <i className="ti ti-x text-lg" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}