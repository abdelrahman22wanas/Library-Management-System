import { useEffect, useState } from 'react'
import client from '../api/client'
import DataTable from '../components/DataTable'
import { useToast } from '../components/Toast'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const addToast = useToast()

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await client.get('/users')
      setUsers(res.data)
    } catch {
      addToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const addUser = async (e) => {
    e.preventDefault()
    try {
      await client.post('/users', { name, email })
      addToast('User added successfully')
      setName(''); setEmail('')
      await fetchUsers()
    } catch (err) {
      addToast(err.response?.data || 'Failed to add user', 'error')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <span className="text-sm text-gray-400">{users.length} total</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <form onSubmit={addUser} className="lg:col-span-1 p-5 bg-white rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Add User</h2>
          <div className="flex flex-col gap-3">
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Add User</button>
          </div>
        </form>

        <div className="lg:col-span-3">
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            emptyTitle="No users found"
            emptyMessage={search ? 'Try a different search term' : 'Add your first user using the form'}
            emptyIcon="👤"
          />
        </div>
      </div>
    </div>
  )
}
