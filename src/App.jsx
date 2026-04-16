import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import BooksTab from './components/tabs/BooksTab';
import BrowseTab from './components/tabs/BrowseTab';
import UsersTab from './components/tabs/UsersTab';
import LoansTab from './components/tabs/LoansTab';
import Toast from './components/Toast';
import Footer from './components/Footer';

const API_BASE = '/api';

function App() {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [filteredCatalog, setFilteredCatalog] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [booksRes, usersRes, loansRes, catalogRes] = await Promise.all([
        fetch(`${API_BASE}/books`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/loans`),
        fetch(`${API_BASE}/books?catalog=true`),
      ]);

      setBooks(await booksRes.json());
      setUsers(await usersRes.json());
      setLoans(await loansRes.json());
      const catalogData = await catalogRes.json();
      setCatalog(catalogData);
      setFilteredCatalog(catalogData);
    } catch (error) {
      showToast('Error loading data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        showToast('Book added successfully!', 'success');
        await loadBooks();
      }
    } catch (error) {
      showToast('Error adding book: ' + error.message, 'error');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`${API_BASE}/books?id=${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Book deleted successfully!', 'success');
        await loadBooks();
      }
    } catch (error) {
      showToast('Error deleting book: ' + error.message, 'error');
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        showToast('User added successfully!', 'success');
        await loadUsers();
      }
    } catch (error) {
      showToast('Error adding user: ' + error.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_BASE}/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('User deleted successfully!', 'success');
        await loadUsers();
      }
    } catch (error) {
      showToast('Error deleting user: ' + error.message, 'error');
    }
  };

  const handleBorrow = async (loanData) => {
    try {
      const response = await fetch(`${API_BASE}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData),
      });

      if (response.ok) {
        showToast('Book borrowed successfully!', 'success');
        await loadLoans();
      }
    } catch (error) {
      showToast('Error borrowing book: ' + error.message, 'error');
    }
  };

  const handleReturn = async (loanId, returnDate) => {
    try {
      const response = await fetch(
        `${API_BASE}/loans?id=${loanId}&returnDate=${returnDate}`,
        { method: 'PUT' }
      );

      if (response.ok) {
        const loan = await response.json();
        const fine = loan.fine > 0 ? ` (Fine: $${loan.fine.toFixed(2)})` : '';
        showToast(`Book returned successfully!${fine}`, 'success');
        await loadLoans();
      }
    } catch (error) {
      showToast('Error returning book: ' + error.message, 'error');
    }
  };

  const handleAddFromCatalog = async (catalogId, title, author) => {
    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, copies: 1, catalogId }),
      });

      if (response.ok) {
        showToast(`"${title}" added to library!`, 'success');
        await loadBooks();
        // Re-render catalog to update button states
        loadAllData();
      }
    } catch (error) {
      showToast('Error adding book: ' + error.message, 'error');
    }
  };

  const loadBooks = () => loadAllData();
  const loadUsers = () => loadAllData();
  const loadLoans = () => loadAllData();

  const filterCatalog = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    setFilteredCatalog(
      catalog.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
      )
    );
  };

  const tabs = {
    books: (
      <BooksTab
        books={books}
        onAddBook={handleAddBook}
        onDeleteBook={handleDeleteBook}
        loading={loading}
      />
    ),
    browse: (
      <BrowseTab
        catalog={filteredCatalog}
        books={books}
        onSearch={filterCatalog}
        onAddBook={handleAddFromCatalog}
        loading={loading}
      />
    ),
    users: (
      <UsersTab
        users={users}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        loading={loading}
      />
    ),
    loans: (
      <LoansTab
        loans={loans}
        books={books}
        users={users}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
        loading={loading}
      />
    ),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="content">{tabs[activeTab]}</main>
      <Footer />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}

export default App;
