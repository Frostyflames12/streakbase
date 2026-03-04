// src/components/ConfirmModal.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// --- Icons ---
const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [visible, setVisible] = useState(false);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) setVisible(true);
    else setTimeout(() => setVisible(false), 300); // Wait for animation to finish
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  // Use a Portal to render outside the parent DOM hierarchy (prevents z-index issues)
  return createPortal(
    <div className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0 duration-300 transition-all ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div 
        className={`
          relative w-full max-w-sm bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0'}
        `}
      >
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Glowing Icon Wrapper */}
          <div className="mb-5 relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-red-500 shadow-lg">
               <AlertIcon />
            </div>
          </div>

          <h2 className="text-white font-black text-xl tracking-tight mb-2">
            {title}
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-xl bg-slate-800/50 border border-white/5 text-slate-300 font-bold text-sm hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm shadow-lg shadow-red-900/20 hover:shadow-red-500/30 border border-red-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative">{confirmLabel}</span>
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body // Renders the modal at the root of the document
  );
}