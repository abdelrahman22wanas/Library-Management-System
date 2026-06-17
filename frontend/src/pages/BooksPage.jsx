import { useEffect, useState } from 'react'
import client from '../api/client'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { useToast } from '../components/Toast'

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [copies, setCopies] = useState(1)
  const addToast = useToast()

  const filtered = books.filter(b =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  )

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await client.get('/books')
      setBooks(res.data)
    } catch {
      addToast('Failed to load books', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [])

  const addBook = async (e) => {
    e.preventDefault()
    try {
      await client.post('/books', { title, author, copies })
      addToast('Book added successfully')
      setTitle(''); setAuthor(''); setCopies(1)
      await fetchBooks()
    } catch (err) {
      addToast(err.response?.data || 'Failed to add book', 'error')
    }
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'totalCopies', label: 'Total', align: 'center' },
    { key: 'availableCopies', label: 'Available', align: 'center' },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      sortable: false,
      render: (b) => (
        <StatusBadge variant={b.availableCopies > 0 ? 'available' : 'unavailable'}>
          {b.availableCopies > 0 ? 'Available' : 'Unavailable'}
        </StatusBadge>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Books</h1>
        <span className="text-sm text-gray-400">{books.length} total</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <form onSubmit={addBook} className="lg:col-span-1 p-5 bg-white rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Add Book</h2>
          <div className="flex flex-col gap-3">
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Copies</label>
              <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" type="number" min="1" value={copies} onChange={e => setCopies(Number(e.target.value))} />
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Add Book</button>
          </div>
        </form>

        <div className="lg:col-span-3">
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Search by title or author…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            emptyTitle="No books found"
            emptyMessage={search ? 'Try a different search term' : 'Add your first book using the form'}
            emptyIcon="📚"
          />
        </div>
      </div>
    </div>
  )
}
