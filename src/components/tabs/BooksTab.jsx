import React, { useState } from 'react';

function BooksTab({ books, onAddBook, onDeleteBook, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    copies: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.author) {
      onAddBook(formData);
      setFormData({ title: '', author: '', copies: 1 });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'copies' ? parseInt(e.target.value) : e.target.value,
    });
  };

  return (
    <>
      <div className="card">
        <h2>➕ Add New Book</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={formData.author}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="copies"
            placeholder="Number of Copies"
            min="1"
            value={formData.copies}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary">
            ✨ Add Book
          </button>
        </form>
      </div>

      <div className="card">
        <h2>📚 Book Inventory</h2>
        {loading ? (
          <p className="loading">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="empty-state">No books added yet. Start by adding a book or browsing the catalog!</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Copies</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.copies}</td>
                    <td>
                      <span className="badge badge-success">{book.copies}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteBook(book.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default BooksTab;
