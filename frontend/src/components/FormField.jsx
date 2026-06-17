export default function FormField({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
