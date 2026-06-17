import { useEffect, useState } from 'react'
import client from '../api/client'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await client.get('/users')
      setUsers(res.data)
    } catch {
      setError('Failed to load users')
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const addUser = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await client.post('/users', { name, email })
      setName(''); setEmail('')
      await fetchUsers()
    } catch (err) {
      setError(err.response?.data || 'Failed to add user')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Users</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={addUser} className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <input className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[150px]" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px]" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">Add User</button>
      </form>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400">No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
