export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-sm p-6">
        <p className="text-sm text-[#1B1B1B] mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-xs tracking-widest uppercase border border-[#EBEBEB] text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-xs tracking-widest uppercase bg-[#1B1B1B] text-white hover:bg-black transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}