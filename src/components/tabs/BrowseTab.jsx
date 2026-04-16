import React from 'react';

function BrowseTab({ catalog, books, onSearch, onAddBook, loading }) {
  const isBookAdded = (title, author) => {
    return books.some((b) => b.title === title && b.author === author);
  };

  return (
    <div className="card">
      <h2>🔍 Browse Our Catalog</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
        Select books to add to your library. Search or scroll to find titles. 99 books available!
      </p>

      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search by title or author..."
        onChange={(e) => onSearch(e.target.value)}
      />

      {loading ? (
        <p className="loading">Loading catalog...</p>
      ) : catalog.length === 0 ? (
        <p className="empty-state">No books found matching your search.</p>
      ) : (
        <div className="catalog-grid">
          {catalog.map((book) => {
            const added = isBookAdded(book.title, book.author);
            return (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <button
                  className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => onAddBook(book.id, book.title, book.author)}
                  disabled={added}
                >
                  {added ? '✓ Added to Library' : '+ Add to Library'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BrowseTab;
