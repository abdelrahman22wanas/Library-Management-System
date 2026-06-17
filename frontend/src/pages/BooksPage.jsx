import { useEffect, useState } from 'react'
import client from '../api/client'

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [copies, setCopies] = useState(1)
  const [error, setError] = useState('')

  const fetchBooks = async () => {
    try {
      const res = await client.get('/books')
      setBooks(res.data)
    } catch {
      setError('Failed to load books')
    }
  }

  useEffect(() => { fetchBooks() }, [])

  const addBook = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await client.post('/books', { title, author, copies })
      setTitle(''); setAuthor(''); setCopies(1)
      await fetchBooks()
    } catch (err) {
      setError(err.response?.data || 'Failed to add book')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Books</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={addBook} className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <input className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[150px]" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[150px]" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
        <input className="border border-gray-300 rounded px-3 py-2 text-sm w-20" type="number" min="1" value={copies} onChange={e => setCopies(Number(e.target.value))} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">Add Book</button>
      </form>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Author</th>
              <th className="text-center px-4 py-3 font-medium">Total</th>
              <th className="text-center px-4 py-3 font-medium">Available</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{b.title}</td>
                <td className="px-4 py-3 text-gray-600">{b.author}</td>
                <td className="px-4 py-3 text-center">{b.totalCopies}</td>
                <td className="px-4 py-3 text-center">{b.availableCopies}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${b.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {b.availableCopies > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No books yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
