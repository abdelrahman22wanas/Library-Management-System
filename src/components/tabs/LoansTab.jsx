import React, { useState, useEffect } from 'react';

function LoansTab({ loans, books, users, onBorrow, onReturn, loading }) {
  const [borrowData, setBorrowData] = useState({
    userId: '',
    bookId: '',
    duration: 14,
  });

  const [returnData, setReturnData] = useState({
    loanId: '',
    returnDate: new Date().toISOString().split('T')[0],
  });

  const activeLoans = loans.filter((l) => !l.returnDate);

  const handleBorrowSubmit = (e) => {
    e.preventDefault();
    if (borrowData.userId && borrowData.bookId) {
      onBorrow(borrowData);
      setBorrowData({ userId: '', bookId: '', duration: 14 });
    }
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (returnData.loanId) {
      onReturn(returnData.loanId, returnData.returnDate);
      setReturnData({ loanId: '', returnDate: new Date().toISOString().split('T')[0] });
    }
  };

  const getAvailableCopies = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return 0;
    const borrowedCount = loans.filter((l) => l.bookId === bookId && !l.returnDate).length;
    return Math.max(0, book.copies - borrowedCount);
  };

  return (
    <>
      <div className="card">
        <h2>📤 Borrow Books</h2>
        <form onSubmit={handleBorrowSubmit}>
          <select
            value={borrowData.userId}
            onChange={(e) => setBorrowData({ ...borrowData, userId: e.target.value })}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <select
            value={borrowData.bookId}
            onChange={(e) => setBorrowData({ ...borrowData, bookId: e.target.value })}
            required
          >
            <option value="">Select Book</option>
            {books
              .filter((book) => getAvailableCopies(book.id) > 0)
              .map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} ({getAvailableCopies(book.id)} available)
                </option>
              ))}
          </select>
          <input
            type="number"
            placeholder="Loan Duration (days)"
            min="1"
            value={borrowData.duration}
            onChange={(e) => setBorrowData({ ...borrowData, duration: parseInt(e.target.value) })}
          />
          <button type="submit" className="btn btn-success">
            📖 Borrow Book
          </button>
        </form>
      </div>

      <div className="card">
        <h2>📥 Return Books</h2>
        <form onSubmit={handleReturnSubmit}>
          <select
            value={returnData.loanId}
            onChange={(e) => setReturnData({ ...returnData, loanId: e.target.value })}
            required
          >
            <option value="">Select Active Loan</option>
            {activeLoans.map((loan) => {
              const user = users.find((u) => u.id === loan.userId);
              const book = books.find((b) => b.id === loan.bookId);
              return (
                <option key={loan.id} value={loan.id}>
                  {user?.name || 'Unknown'} - {book?.title || 'Unknown'}
                </option>
              );
            })}
          </select>
          <input
            type="date"
            value={returnData.returnDate}
            onChange={(e) => setReturnData({ ...returnData, returnDate: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">
            ✨ Return Book
          </button>
        </form>
      </div>

      <div className="card">
        <h2>📋 Loan History</h2>
        {loading ? (
          <p className="loading">Loading loans...</p>
        ) : loans.length === 0 ? (
          <p className="empty-state">No loans recorded yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Borrowed</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Fine</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => {
                  const user = users.find((u) => u.id === loan.userId);
                  const book = books.find((b) => b.id === loan.bookId);
                  const borrowDate = new Date(loan.borrowDate).toLocaleDateString();
                  const dueDate = new Date(loan.dueDate).toLocaleDateString();
                  const isOverdue = !loan.returnDate && new Date() > new Date(loan.dueDate);
                  const fine = loan.fine ? `$${loan.fine.toFixed(2)}` : '-';

                  let statusBadge = 'badge-warning';
                  let statusText = 'Active';

                  if (loan.returnDate) {
                    statusBadge = 'badge-success';
                    statusText = 'Returned';
                  } else if (isOverdue) {
                    statusBadge = 'badge-danger';
                    statusText = 'Overdue';
                  }

                  return (
                    <tr key={loan.id}>
                      <td>{user?.name || 'Unknown'}</td>
                      <td>{book?.title || 'Unknown'}</td>
                      <td>{borrowDate}</td>
                      <td>{dueDate}</td>
                      <td>
                        <span className={`badge ${statusBadge}`}>{statusText}</span>
                      </td>
                      <td>{fine}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default LoansTab;
