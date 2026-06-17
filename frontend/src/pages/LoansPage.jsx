import { useEffect, useState } from 'react'
import client from '../api/client'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../components/Toast'

const tabs = ['Borrow', 'Return', 'History']

function fmt(d) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(loan) {
  if (loan.returnedDate) return false
  return new Date(loan.dueDate + 'T00:00:00') < new Date()
}

function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00')
  const d2 = new Date(b + 'T00:00:00')
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
}

export default function LoansPage() {
  const [tab, setTab] = useState('Borrow')
  const [loans, setLoans] = useState([])
  const [activeLoans, setActiveLoans] = useState([])
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  // Borrow form
  const [borrowUserId, setBorrowUserId] = useState('')
  const [borrowBookId, setBorrowBookId] = useState('')
  const [loanDays, setLoanDays] = useState(14)

  // Return form
  const [returnLoanId, setReturnLoanId] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [returnPreview, setReturnPreview] = useState(null)

  const bookMap = {}
  books.forEach(b => { bookMap[b.id] = b })
  const userMap = {}
  users.forEach(u => { userMap[u.id] = u })

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [loansRes, activeRes, booksRes, usersRes] = await Promise.all([
        client.get('/loans'),
        client.get('/loans/active'),
        client.get('/books'),
        client.get('/users'),
      ])
      setLoans(loansRes.data)
      setActiveLoans(activeRes.data)
      setBooks(booksRes.data)
      setUsers(usersRes.data)
    } catch {
      addToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    if (!returnLoanId) { setReturnPreview(null); return }
    const loan = loans.find(l => l.id === returnLoanId)
    if (!loan) { setReturnPreview(null); return }
    const rd = returnDate || new Date().toISOString().slice(0, 10)
    const overdue = isOverdue({ ...loan, dueDate: loan.dueDate })
    const overdueDays = rd > loan.dueDate ? daysBetween(loan.dueDate, rd) : 0
    const fine = overdueDays > 0 ? (overdueDays * 1).toFixed(2) : '0.00'
    setReturnPreview({ loan, overdue, overdueDays, fine, book: bookMap[loan.bookId], user: userMap[loan.userId] })
  }, [returnLoanId, returnDate, loans])

  const borrowBook = async (e) => {
    e.preventDefault()
    try {
      await client.post('/loans/borrow', null, {
        params: { userId: borrowUserId, bookId: borrowBookId, loanDays },
      })
      addToast('Book borrowed successfully')
      setBorrowUserId(''); setBorrowBookId(''); setLoanDays(14)
      await fetchAll()
    } catch (err) {
      addToast(err.response?.data || 'Failed to borrow book', 'error')
    }
  }

  const handleReturn = async (e) => {
    e.preventDefault()
    try {
      const params = { loanId: returnLoanId }
      if (returnDate) params.returnDate = returnDate
      await client.post('/loans/return', null, { params })
      addToast('Book returned successfully')
      setReturnLoanId(''); setReturnDate(''); setReturnPreview(null)
      await fetchAll()
    } catch (err) {
      addToast(err.response?.data || 'Failed to return book', 'error')
    }
  }

  const historyColumns = [
    {
      key: 'book', label: 'Book',
      render: (l) => bookMap[l.bookId]?.title || 'Unknown',
    },
    {
      key: 'user', label: 'User',
      render: (l) => userMap[l.userId]?.name || 'Unknown',
    },
    { key: 'borrowedDate', label: 'Borrowed', align: 'center', render: (l) => fmt(l.borrowedDate) },
    { key: 'dueDate', label: 'Due', align: 'center', render: (l) => fmt(l.dueDate) },
    {
      key: 'returnedDate', label: 'Returned', align: 'center',
      render: (l) => l.returnedDate ? fmt(l.returnedDate) : <StatusBadge variant="active">Active</StatusBadge>,
    },
    {
      key: 'fine', label: 'Fine', align: 'center',
      render: (l) => {
        if (!l.returnedDate) return '—'
        const f = l.fineAccrued
        if (!f || f === '0.00' || f === 0) return '—'
        return <span className="text-yellow-700 font-medium">${f}</span>
      },
    },
  ]

  const calcDue = borrowBookId && loanDays > 0
    ? new Date(Date.now() + loanDays * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  if (loading) return <LoadingSpinner text="Loading loans..." />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Loans</h1>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Borrow' && (
        <form onSubmit={borrowBook} className="max-w-lg p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Borrow a Book</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">User</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" value={borrowUserId} onChange={e => setBorrowUserId(e.target.value)} required>
                <option value="">Select user…</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Book</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" value={borrowBookId} onChange={e => setBorrowBookId(e.target.value)} required>
                <option value="">Select book…</option>
                {books.filter(b => b.availableCopies > 0).map(b => (
                  <option key={b.id} value={b.id}>{b.title} — {b.availableCopies} available</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Loan Duration (days)</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" type="number" min="1" value={loanDays} onChange={e => setLoanDays(Number(e.target.value))} />
              {calcDue && <p className="text-xs text-gray-400 mt-1">Due: {calcDue}</p>}
            </div>
            <button className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">Borrow</button>
          </div>
        </form>
      )}

      {tab === 'Return' && (
        <form onSubmit={handleReturn} className="max-w-lg p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Return a Book</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Active Loan</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" value={returnLoanId} onChange={e => setReturnLoanId(e.target.value)} required>
                <option value="">Select active loan…</option>
                {activeLoans.map(l => (
                  <option key={l.id} value={l.id}>
                    {bookMap[l.bookId]?.title || 'Unknown'} — {userMap[l.userId]?.name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Return Date</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Leave blank for today</p>
            </div>

            {returnPreview && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1.5">
                <p><span className="text-gray-500">Book:</span> <span className="font-medium">{returnPreview.book?.title || 'Unknown'}</span></p>
                <p><span className="text-gray-500">User:</span> <span className="font-medium">{returnPreview.user?.name || 'Unknown'}</span></p>
                <p><span className="text-gray-500">Borrowed:</span> {fmt(returnPreview.loan.borrowedDate)}</p>
                <p><span className="text-gray-500">Due:</span> {fmt(returnPreview.loan.dueDate)}</p>
                {returnPreview.overdue && (
                  <p className="text-orange-600 font-medium">
                    Overdue by {returnPreview.overdueDays} day{returnPreview.overdueDays !== 1 ? 's' : ''}
                  </p>
                )}
                {returnPreview.fine !== '0.00' && (
                  <p className="text-yellow-700 font-medium">Fine: ${returnPreview.fine}</p>
                )}
              </div>
            )}

            <button className="bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors" disabled={!returnLoanId}>Return Book</button>
          </div>
        </form>
      )}

      {tab === 'History' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Active Loans ({activeLoans.length})</h2>
            <DataTable
              columns={historyColumns.slice(0, 5)}
              data={activeLoans}
              loading={false}
              emptyTitle="No active loans"
              emptyIcon="✅"
              keyField="id"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">All Loans ({loans.length})</h2>
            <DataTable
              columns={historyColumns}
              data={loans}
              loading={false}
              emptyTitle="No loans yet"
              emptyIcon="📜"
              keyField="id"
            />
          </div>
        </div>
      )}
    </div>
  )
}
