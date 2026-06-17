export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-500 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-400 mb-4">{message}</p>}
      {action && action}
    </div>
  )
}
