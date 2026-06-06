export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a href="https://instagram.com/pura_vida_fragance" target="_blank" rel="noreferrer"
        className="w-12 h-12 bg-[#1B1B1B] flex items-center justify-center hover:bg-black transition-colors"
        aria-label="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="white"/>
        </svg>
      </a>
      <a href="https://wa.me/50670987605" target="_blank" rel="noreferrer"
        className="w-12 h-12 bg-[#25D366] flex items-center justify-center hover:bg-[#1db954] transition-colors"
        aria-label="WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12.001 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.8a.5.5 0 0 0 .628.63l3.8-.918A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.073-1.113l-.29-.174-2.167.524.5-2.089-.192-.305A8 8 0 1 1 12 20zm4.406-5.846c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.94-1.2 7.3 7.3 0 0 1-1.344-1.674c-.14-.24-.015-.37.105-.49.108-.107.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.468-.394-.404-.54-.412l-.46-.008a.88.88 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2.006c0 1.183.863 2.326.983 2.486.12.16 1.7 2.596 4.12 3.64.576.248 1.025.396 1.375.507.578.184 1.104.158 1.52.096.463-.069 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
        </svg>
      </a>
    </div>
  );
}