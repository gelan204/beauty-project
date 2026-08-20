export function Modal({ open, onClose, title = '', children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black opacity-40" />

      <div
        className="relative z-10 w-full max-w-lg max-h-[80vh] overflow-auto rounded-2xl bg-white p-6 soft-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-lg"
        >
          ✕
        </button>
        {title ? <h3 className="serif mb-4 text-xl">{title}</h3> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
