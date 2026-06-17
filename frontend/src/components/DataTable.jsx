import { useState, useMemo } from 'react'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyTitle = 'No data',
  emptyMessage = '',
  emptyIcon = '📭',
  emptyAction,
  sortable = true,
  keyField = 'id',
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const sorted = useMemo(() => {
    if (!sortKey || !sortable) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir, sortable])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (loading) return <LoadingSpinner />

  if (sorted.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} action={emptyAction} />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-xs uppercase tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${sortable && col.sortable !== false ? 'cursor-pointer select-none hover:text-gray-900' : ''}`}
                onClick={() => sortable && col.sortable !== false && toggleSort(col.key)}
              >
                {col.label}
                {sortable && col.sortable !== false && sortKey === col.key && (
                  <span className="ml-1 text-indigo-500">{sortDir === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sorted.map(row => (
            <tr key={row[keyField]} className="hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
