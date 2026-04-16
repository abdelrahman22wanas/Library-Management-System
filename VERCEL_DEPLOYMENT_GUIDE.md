# Library Management System - Web Version (Vercel)

This is a web-based version of the Library Management System optimized for deployment on Vercel.

## 🌐 What's Different from Desktop Version

| Feature | Desktop (Java) | Web (Vercel) |
|---------|---|---|
| **Platform** | Windows/Java Desktop | Web Browser |
| **Frontend** | JavaFX | HTML/CSS/JavaScript |
| **Backend** | File-based JSON | Vercel Functions |
| **Storage** | Local files | In-memory (demo) / Supabase (prod) |
| **Deployment** | Batch file launcher | Vercel hosting |

## ✨ Features

- 📚 **Manage Books** - Add, view, and delete books
- 👥 **Manage Users** - Add library users
- 📖 **Borrow & Return** - Track book loans with due dates
- 💰 **Automatic Fine Calculation** - $1.00 per overdue day
- 🎨 **Modern Responsive UI** - Works on desktop and mobile
- ⚡ **Serverless Backend** - Runs on Vercel Functions

## 🚀 Quick Start

### Deploy to Vercel (Recommended)

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/yourusername/Library-Management-System.git
   cd Library-Management-System
   git checkout web-version
   ```

2. **Push to GitHub**
   ```bash
   git push origin web-version
   ```

3. **Deploy to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `web-version` branch
   - Click "Deploy"
   - Your app will be live in seconds!

### Run Locally

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Run development server**
   ```bash
   vercel dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
web-version/
├── public/                    # Frontend files (served as-is)
│   ├── index.html            # Main HTML page
│   ├── style.css             # Responsive styling
│   └── script.js             # Frontend logic (vanilla JS)
│
├── api/                       # Vercel Functions (serverless backend)
│   ├── books.js              # Books API endpoint
│   ├── users.js              # Users API endpoint
│   └── loans.js              # Loans API endpoint
│
├── package.json              # NPM dependencies
├── vercel.json               # Vercel configuration
└── README.md                 # This file
```

## 🔌 API Endpoints

All API endpoints are available at `/api/{resource}`:

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
  ```json
  { "title": "...", "author": "...", "copies": 1 }
  ```
- `DELETE /api/books?id=...` - Delete a book

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Add a new user
  ```json
  { "name": "...", "email": "..." }
  ```
- `DELETE /api/users?id=...` - Delete a user

### Loans
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Borrow a book
  ```json
  { "userId": "...", "bookId": "...", "duration": 14 }
  ```
- `PUT /api/loans?id=...&returnDate=...` - Return a book
- `DELETE /api/loans?id=...` - Delete a loan

## 🗄️ Data Persistence (Next Steps)

The current version uses in-memory storage (data resets on restart). For production, integrate Supabase:

### Setup Supabase

1. Create a free account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL migrations in `scripts/supabase-migrations.sql`
4. Add environment variables to Vercel:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   ```
5. Replace API endpoints with Supabase client calls

## 🌍 Environment Variables

Create a `.env.local` file for local development:

```env
VERCEL_ENV=development
```

## 📚 Usage

### Adding Books
1. Click **Books** tab
2. Enter title, author, and number of copies
3. Click **Add Book**

### Adding Users
1. Click **Users** tab
2. Enter name and email
3. Click **Add User**

### Borrowing Books
1. Click **Loans** tab
2. Select a user and available book
3. Set loan duration (default 14 days)
4. Click **Borrow Book**

### Returning Books
1. In **Loans** tab, find the active loan
2. Select return date
3. Click **Return Book**
4. Fine is auto-calculated if overdue

## 🔧 Configuration

### Change Daily Fine Rate
Edit `api/loans.js`:
```javascript
const DAILY_FINE_RATE = 1.00; // Change this value
```

### Customize UI Theme
Edit `public/style.css` and modify CSS variables:
```css
:root {
    --primary-color: #1e3a8a;
    --accent-color: #3b82f6;
    /* ... etc */
}
```

## 🚨 Limitations & Future Improvements

**Current Limitations:**
- ❌ Data is reset when Vercel restarts
- ❌ No user authentication
- ❌ No analytics or reporting

**Coming Soon:**
- ✅ Supabase integration for persistent storage
- ✅ User authentication (OAuth/Email)
- ✅ Fine payment tracking
- ✅ Book recommendations
- ✅ Email notifications for overdue books

## 📦 Production Checklist

Before going to production:

- [ ] Add Supabase integration
- [ ] Enable user authentication
- [ ] Add error logging (Sentry)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure custom domain
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Add environment variables for secrets
- [ ] Test on mobile devices

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
- Check existing [GitHub Issues](https://github.com/yourusername/Library-Management-System/issues)
- Open a new issue with details
- Check [Vercel Documentation](https://vercel.com/docs)

---

**Happy Library Managing!** 📚✨

**Deployment Status:** Ready for Vercel
**Last Updated:** April 16, 2026
