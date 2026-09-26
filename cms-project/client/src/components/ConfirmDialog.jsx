export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4">
      <div className="card w-full max-w-sm p-6">
        <h3 className="font-serif text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mt-2 text-sm text-ink-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger border border-red-200" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
