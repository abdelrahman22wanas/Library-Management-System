import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, usersRes, loansRes, activeRes] = await Promise.all([
          client.get('/books'),
          client.get('/users'),
          client.get('/loans'),
          client.get('/loans/active'),
        ])
        const books = booksRes.data
        const activeLoans = activeRes.data
        const today = new Date().toISOString().slice(0, 10)
        const overdue = activeLoans.filter(l => l.dueDate < today)
        setStats({
          totalBooks: books.length,
          availableBooks: books.reduce((s, b) => s + b.availableCopies, 0),
          totalUsers: usersRes.data.length,
          activeLoans: activeLoans.length,
          overdueLoans: overdue.length,
          recentLoans: loansRes.data.slice(-5).reverse(),
        })
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <LoadingSpinner text="Loading dashboard..." />

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">Could not connect to the backend.</p>
        <p className="text-sm mt-1">Make sure the API server is running.</p>
      </div>
    )
  }

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, color: 'bg-indigo-500', icon: '📚' },
    { label: 'Available Copies', value: stats.availableBooks, color: 'bg-green-500', icon: '📖' },
    { label: 'Active Loans', value: stats.activeLoans, color: 'bg-blue-500', icon: '📋' },
    { label: 'Overdue', value: stats.overdueLoans, color: stats.overdueLoans > 0 ? 'bg-orange-500' : 'bg-gray-400', icon: '⚠️' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{c.icon}</span>
              <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${c.color}`}>{c.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          <Link to="/loans" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all &rarr;</Link>
        </div>
        {stats.recentLoans.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No loan activity yet</p>
        ) : (
          <div className="space-y-3">
            {stats.recentLoans.map(l => (
              <div key={l.id} className="flex items-center gap-3 text-sm text-gray-600 py-2 border-b border-gray-100 last:border-0">
                <span className="text-lg">{l.returnedDate ? '↩️' : '📤'}</span>
                <span className="flex-1">
                  {l.returnedDate ? 'Returned' : 'Borrowed'} on {new Date(l.borrowedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                {l.returnedDate && <span className="text-gray-400 text-xs">Returned: {new Date(l.returnedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Link to="/books" className="block p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-indigo-600">📚 Manage Books</p>
          <p className="text-xs text-gray-400 mt-1">Add and view books</p>
        </Link>
        <Link to="/users" className="block p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-indigo-600">👤 Manage Users</p>
          <p className="text-xs text-gray-400 mt-1">Add and view users</p>
        </Link>
        <Link to="/loans" className="block p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-indigo-600">📋 Manage Loans</p>
          <p className="text-xs text-gray-400 mt-1">Borrow and return books</p>
        </Link>
      </div>
    </div>
  )
}
