// src/components/ConfirmModal.tsx

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 fade-in">
        
        {/* Decorative top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-700 rounded-full mt-3" />

        <div className="mt-3">
          <h2 className="text-white font-black text-xl tracking-tight mb-2">{title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-800 border border-white/5 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/30 hover:border-red-500/50 transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}