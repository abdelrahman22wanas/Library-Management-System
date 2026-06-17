import { useEffect, useState } from 'react'
import client from '../api/client'

export default function LoansPage() {
  const [loans, setLoans] = useState([])
  const [activeLoans, setActiveLoans] = useState([])
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])

  const [borrowUserId, setBorrowUserId] = useState('')
  const [borrowBookId, setBorrowBookId] = useState('')
  const [loanDays, setLoanDays] = useState(14)

  const [returnLoanId, setReturnLoanId] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const [error, setError] = useState('')

  const bookMap = (id) => books.find(b => b.id === id)
  const userMap = (id) => users.find(u => u.id === id)

  const fetchAll = async () => {
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
      setError('Failed to load data')
    }
  }

  useEffect(() => { fetchAll() }, [])

  const borrowBook = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await client.post('/loans/borrow', null, {
        params: { userId: borrowUserId, bookId: borrowBookId, loanDays },
      })
      setBorrowUserId(''); setBorrowBookId(''); setLoanDays(14)
      await fetchAll()
    } catch (err) {
      setError(err.response?.data || 'Failed to borrow book')
    }
  }

  const returnBook = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const params = { loanId: returnLoanId }
      if (returnDate) params.returnDate = returnDate
      await client.post('/loans/return', null, { params })
      setReturnLoanId(''); setReturnDate('')
      await fetchAll()
    } catch (err) {
      setError(err.response?.data || 'Failed to return book')
    }
  }

  const fineDisplay = (loan) => {
    if (!loan.returnedDate) return '—'
    const fine = loan.fineAccrued
    if (!fine || fine === '0.00' || fine === 0) return '—'
    return `$${fine}`
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Loans</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <form onSubmit={borrowBook} className="p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Borrow Book</h2>
          <div className="flex flex-col gap-3">
            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={borrowUserId} onChange={e => setBorrowUserId(e.target.value)} required>
              <option value="">Select user…</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={borrowBookId} onChange={e => setBorrowBookId(e.target.value)} required>
              <option value="">Select book…</option>
              {books.filter(b => b.availableCopies > 0).map(b => (
                <option key={b.id} value={b.id}>{b.title} — {b.availableCopies} available</option>
              ))}
            </select>
            <input className="border border-gray-300 rounded px-3 py-2 text-sm" type="number" min="1" placeholder="Loan days" value={loanDays} onChange={e => setLoanDays(Number(e.target.value))} />
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors">Borrow</button>
          </div>
        </form>

        <form onSubmit={returnBook} className="p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Return Book</h2>
          <div className="flex flex-col gap-3">
            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={returnLoanId} onChange={e => setReturnLoanId(e.target.value)} required>
              <option value="">Select active loan…</option>
              {activeLoans.map(l => (
                <option key={l.id} value={l.id}>
                  {bookMap(l.bookId)?.title || 'Unknown'} — {userMap(l.userId)?.name || 'Unknown'}
                </option>
              ))}
            </select>
            <input className="border border-gray-300 rounded px-3 py-2 text-sm" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
            <p className="text-xs text-gray-400 -mt-2">Leave blank for today</p>
            <button className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-700 transition-colors">Return</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <h2 className="text-lg font-semibold text-gray-800 px-4 pt-4 pb-2">Active Loans ({activeLoans.length})</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Book</th>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-center px-4 py-3 font-medium">Borrowed</th>
              <th className="text-center px-4 py-3 font-medium">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activeLoans.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{bookMap(l.bookId)?.title || 'Unknown'}</td>
                <td className="px-4 py-3 text-gray-600">{userMap(l.userId)?.name || 'Unknown'}</td>
                <td className="px-4 py-3 text-center">{l.borrowedDate}</td>
                <td className="px-4 py-3 text-center">{l.dueDate}</td>
              </tr>
            ))}
            {activeLoans.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No active loans</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-800 px-4 pt-4 pb-2">All Loans ({loans.length})</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Book</th>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-center px-4 py-3 font-medium">Borrowed</th>
              <th className="text-center px-4 py-3 font-medium">Due</th>
              <th className="text-center px-4 py-3 font-medium">Returned</th>
              <th className="text-center px-4 py-3 font-medium">Fine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{bookMap(l.bookId)?.title || 'Unknown'}</td>
                <td className="px-4 py-3 text-gray-600">{userMap(l.userId)?.name || 'Unknown'}</td>
                <td className="px-4 py-3 text-center">{l.borrowedDate}</td>
                <td className="px-4 py-3 text-center">{l.dueDate}</td>
                <td className="px-4 py-3 text-center">{l.returnedDate || '—'}</td>
                <td className="px-4 py-3 text-center">{fineDisplay(l)}</td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No loans yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
