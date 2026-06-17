const variants = {
  available: 'bg-green-100 text-green-700',
  unavailable: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-700',
  returned: 'bg-gray-100 text-gray-600',
  overdue: 'bg-orange-100 text-orange-700',
  fine: 'bg-yellow-100 text-yellow-800',
}

export default function StatusBadge({ variant = 'active', children }) {
  const cls = variants[variant] || variants.active
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}
