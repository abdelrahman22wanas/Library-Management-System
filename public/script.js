// Configuration
const API_BASE = '/api';

// State Management
const state = {
    books: [],
    users: [],
    loans: [],
    catalog: [],
    filteredCatalog: [],
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadData();
    loadCatalog();
});

// Event Listeners
function setupEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Form Submissions
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
    document.getElementById('borrowForm').addEventListener('submit', handleBorrow);
    document.getElementById('returnForm').addEventListener('submit', handleReturn);

    // Catalog Search
    document.getElementById('catalogSearch').addEventListener('input', (e) => {
        filterCatalog(e.target.value);
    });
}

// Tab Switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Load Data from API
async function loadData() {
    try {
        await Promise.all([
            loadBooks(),
            loadUsers(),
            loadLoans(),
        ]);
    } catch (error) {
        showToast('Error loading data: ' + error.message, 'error');
    }
}

async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        state.books = await response.json();
        renderBooks();
        updateBookDropdowns();
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        state.users = await response.json();
        renderUsers();
        updateUserDropdowns();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadLoans() {
    try {
        const response = await fetch(`${API_BASE}/loans`);
        state.loans = await response.json();
        renderLoans();
        updateLoanDropdowns();
    } catch (error) {
        console.error('Error loading loans:', error);
    }
}

async function loadCatalog() {
    try {
        const response = await fetch(`${API_BASE}/books?catalog=true`);
        state.catalog = await response.json();
        state.filteredCatalog = state.catalog;
        renderCatalog();
    } catch (error) {
        console.error('Error loading catalog:', error);
    }
}

function filterCatalog(searchTerm) {
    const term = searchTerm.toLowerCase();
    state.filteredCatalog = state.catalog.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
    );
    renderCatalog();
}

// Books Operations
async function handleAddBook(e) {
    e.preventDefault();

    const book = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        copies: parseInt(document.getElementById('bookCopies').value),
    };

    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book),
        });

        if (response.ok) {
            showToast('Book added successfully!', 'success');
            document.getElementById('addBookForm').reset();
            await loadBooks();
        }
    } catch (error) {
        showToast('Error adding book: ' + error.message, 'error');
    }
}

function renderBooks() {
    const container = document.getElementById('booksContainer');

    if (state.books.length === 0) {
        container.innerHTML = '<p class="empty-state">No books added yet.</p>';
        return;
    }

    let html = `
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
    `;

    state.books.forEach(book => {
        const available = book.copies - (state.loans.filter(l => l.bookId === book.id && !l.returnDate).length || 0);
        html += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.copies}</td>
                <td>
                    <span class="badge ${available > 0 ? 'badge-success' : 'badge-danger'}">
                        ${available}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

async function deleteBook(bookId) {
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
}

function updateBookDropdowns() {
    const select = document.getElementById('borrowBook');
    select.innerHTML = '<option value="">Select Book</option>';

    state.books.forEach(book => {
        const available = book.copies - (state.loans.filter(l => l.bookId === book.id && !l.returnDate).length || 0);
        if (available > 0) {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} (${available} available)`;
            select.appendChild(option);
        }
    });
}

// Users Operations
async function handleAddUser(e) {
    e.preventDefault();

    const user = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
    };

    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            showToast('User added successfully!', 'success');
            document.getElementById('addUserForm').reset();
            await loadUsers();
        }
    } catch (error) {
        showToast('Error adding user: ' + error.message, 'error');
    }
}

function renderUsers() {
    const container = document.getElementById('usersContainer');

    if (state.users.length === 0) {
        container.innerHTML = '<p class="empty-state">No users added yet.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    state.users.forEach(user => {
        const joinDate = new Date(user.createdAt).toLocaleDateString();
        html += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${joinDate}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

async function deleteUser(userId) {
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
}

function updateUserDropdowns() {
    const select = document.getElementById('borrowUser');
    select.innerHTML = '<option value="">Select User</option>';

    state.users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
    });
}

// Loans Operations
async function handleBorrow(e) {
    e.preventDefault();

    const loan = {
        userId: document.getElementById('borrowUser').value,
        bookId: document.getElementById('borrowBook').value,
        duration: parseInt(document.getElementById('borrowDuration').value),
    };

    try {
        const response = await fetch(`${API_BASE}/loans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loan),
        });

        if (response.ok) {
            showToast('Book borrowed successfully!', 'success');
            document.getElementById('borrowForm').reset();
            await loadLoans();
        }
    } catch (error) {
        showToast('Error borrowing book: ' + error.message, 'error');
    }
}

async function handleReturn(e) {
    e.preventDefault();

    const loanId = document.getElementById('activeLoan').value;
    const returnDate = document.getElementById('returnDate').value;

    try {
        const response = await fetch(`${API_BASE}/loans?id=${loanId}&returnDate=${returnDate}`, {
            method: 'PUT',
        });

        if (response.ok) {
            showToast('Book returned successfully!', 'success');
            document.getElementById('returnForm').reset();
            await loadLoans();
        }
    } catch (error) {
        showToast('Error returning book: ' + error.message, 'error');
    }
}

function renderLoans() {
    const container = document.getElementById('loansContainer');

    if (state.loans.length === 0) {
        container.innerHTML = '<p class="empty-state">No loans recorded yet.</p>';
        return;
    }

    let html = `
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
    `;

    state.loans.forEach(loan => {
        const user = state.users.find(u => u.id === loan.userId);
        const book = state.books.find(b => b.id === loan.bookId);
        const borrowDate = new Date(loan.borrowDate).toLocaleDateString();
        const dueDate = new Date(loan.dueDate).toLocaleDateString();
        const isOverdue = !loan.returnDate && new Date() > new Date(loan.dueDate);
        const fine = loan.fine ? `$${loan.fine.toFixed(2)}` : '-';

        const statusBadge = loan.returnDate
            ? '<span class="badge badge-success">Returned</span>'
            : isOverdue
                ? '<span class="badge badge-danger">Overdue</span>'
                : '<span class="badge badge-warning">Active</span>';

        html += `
            <tr>
                <td>${user?.name || 'Unknown'}</td>
                <td>${book?.title || 'Unknown'}</td>
                <td>${borrowDate}</td>
                <td>${dueDate}</td>
                <td>${statusBadge}</td>
                <td>${fine}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function updateLoanDropdowns() {
    const select = document.getElementById('activeLoan');
    select.innerHTML = '<option value="">Select Active Loan</option>';

    state.loans.filter(l => !l.returnDate).forEach(loan => {
        const user = state.users.find(u => u.id === loan.userId);
        const book = state.books.find(b => b.id === loan.bookId);
        const option = document.createElement('option');
        option.value = loan.id;
        option.textContent = `${user?.name || 'Unknown'} - ${book?.title || 'Unknown'}`;
        select.appendChild(option);
    });

    // Set today as default return date
    document.getElementById('returnDate').valueAsDate = new Date();
}

// Catalog Operations
function renderCatalog() {
    const container = document.getElementById('catalogContainer');

    if (state.filteredCatalog.length === 0) {
        container.innerHTML = '<p class="empty-state" style="grid-column: 1/-1;">No books found matching your search.</p>';
        return;
    }

    let html = '';
    state.filteredCatalog.forEach(book => {
        const isAdded = state.books.some(b => b.title === book.title && b.author === book.author);
        const buttonClass = isAdded ? 'btn-secondary' : 'btn-primary';
        const buttonText = isAdded ? '✓ Added to Library' : '+ Add to Library';

        html += `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p class="author">by ${book.author}</p>
                <button class="btn ${buttonClass}" 
                    onclick="addBookFromCatalog('${book.id}', '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}')"
                    ${isAdded ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        `;
    });

    container.innerHTML = `<div class="catalog-grid">${html}</div>`;
}

async function addBookFromCatalog(catalogId, title, author) {
    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                author,
                copies: 1,
                catalogId,
            }),
        });

        if (response.ok) {
            const book = await response.json();
            showToast(`"${title}" added to library!`, 'success');
            await loadBooks();
            renderCatalog(); // Re-render to update button states
        }
    } catch (error) {
        showToast('Error adding book: ' + error.message, 'error');
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}