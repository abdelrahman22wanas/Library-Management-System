# Library Management System

A modern library management application available in **two versions**: Desktop (JavaFX) and Web (React).

## 📦 Two Versions Available

### 🖥️ **Desktop Version** (main branch)
- **Technology**: Java 21 + JavaFX
- **Run**: Double-click `LibraryManagement.bat`
- **Features**: Native desktop app with file-based storage

### 🌐 **Web Version** (web-version branch) ⭐ **NEW**
- **Technology**: React 18 + Vite
- **Run**: `npm run dev`
- **Deploy**: Vercel (instant hosting)
- **Features**: Modern animations, gradient UI, fully responsive

## ✨ Core Features (Both Versions)

- **📚 Manage 99 Pre-loaded Books** - Browse and add books from a curated catalog
- **👥 User Management** - Add, track, and manage library users
- **📖 Borrow & Return System** - Track book loans with automatic due dates
- **💰 Automatic Fine Calculation** - $1.00 per overdue day
- **🔍 Advanced Search** - Filter books by title or author
- **📊 Beautiful UI** - Modern, responsive design
- **💾 Data Persistence** - Save and restore your data

## 🌐 Web Version (Recommended for New Users)

The **web version** is the modern, actively developed version with the latest features!

### ✨ What's Special
- 🎨 **Gradient buttons** with smooth animations
- ⚡ **Lightning-fast** with Vite build tool
- 📱 **Fully responsive** - works on desktop, tablet, mobile
- ☁️ **Deploy anywhere** - Vercel, Netlify, or your own server
- 🎬 **Smooth animations** - fade-ins, slides, hovers
- 🌈 **Modern design** - shadows, depth, glass effects

### 🚀 Quick Start (Web)

#### Development
```bash
npm install
npm run dev
# Open http://localhost:5173
```

#### Production Build
```bash
npm run build
npm run preview
```

#### Deploy to Vercel
```bash
git push origin web-version
# Then import in Vercel dashboard
```

### 📁 Web Version Structure
```
web-version/
├── src/
│   ├── index.jsx              # React entry point
│   ├── App.jsx                # Main app component
│   ├── styles/index.css       # Modern CSS with animations
│   └── components/
│       ├── Header.jsx
│       ├── TabNavigation.jsx
│       ├── Toast.jsx
│       ├── Footer.jsx
│       └── tabs/
│           ├── BooksTab.jsx
│           ├── BrowseTab.jsx
│           ├── UsersTab.jsx
│           └── LoansTab.jsx
├── api/                       # Vercel serverless functions
│   ├── books.js
│   ├── users.js
│   └── loans.js
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## 🖥️ Desktop Version (Legacy)

For traditional desktop usage, see the desktop version on the **main** branch.

### Prerequisites
- **JDK 21+** (check: `java -version`)
- **Maven 3.9+** (check: `mvn -version`)
- **JavaFX SDK 25.0.1**

### Quick Start (Desktop)

```powershell
# Option 1: Double-click launcher
LibraryManagement.bat

# Option 2: Maven
mvn javafx:run

# Option 3: Manual build
mvn clean package
java --module-path C:\javafx-sdk-25.0.1\lib --add-modules javafx.controls,javafx.fxml -jar target/LibraryManagement.jar
```

## 🎯 Usage Guide

### Web Version Usage

#### Adding Books
1. Click **Books** tab
2. Enter Title, Author, and Copies
3. Click **✨ Add Book** button

#### Browsing Catalog
1. Click **Browse Catalog** tab
2. Use search box to filter books
3. Click **+ Add to Library** on any book
4. Button changes to **✓ Added to Library**

#### Managing Users
1. Click **Users** tab
2. Enter Name and Email
3. Click **✨ Add User** button

#### Borrowing Books
1. Click **Loans** tab
2. Select User from dropdown
3. Select Book from dropdown (shows available copies)
4. Set loan duration (default 14 days)
5. Click **📖 Borrow Book** button

#### Returning Books
1. In **Loans** tab, find the active loan
2. Select from dropdown
3. Set return date
4. Click **✨ Return Book** button
5. Fine is auto-calculated if overdue!

### Desktop Version Usage
See **DESKTOP_APP_BUILD.md** for desktop version usage.

---

## 🎨 Design & Styling (Web Version)

### Color Scheme
| Color | Usage | Gradient |
|-------|-------|----------|
| Blue | Primary actions | #1e3a8a → #3b82f6 |
| Green | Positive actions | #10b981 → #059669 |
| Red | Destructive actions | #ef4444 → #dc2626 |
| Gray | Disabled states | #9ca3af → #6b7280 |

### Animations
- **slideDown**: Header entrance
- **slideUp**: Card animations  
- **fadeInUp**: Content transitions
- **scaleIn**: Book card pop-ins
- **expandWidth**: Tab indicators
- **Hover effects**: Smooth scale and shadow effects

### Shadows
- Small: `0 1px 2px rgba(0,0,0,0.05)`
- Medium: `0 4px 6px rgba(0,0,0,0.1)`
- Large: `0 10px 15px rgba(0,0,0,0.1)`
- Extra: `0 25px 50px rgba(0,0,0,0.25)`

---

## 🌐 Deployment

### Deploy Web Version to Vercel

**Fastest Method:**
1. Push to GitHub: `git push origin web-version`
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import your repository
5. Select `web-version` branch
6. Click "Deploy"
7. Your app is live! 🎉

**Direct from CLI:**
```bash
npm install -g vercel
vercel
# Follow prompts to deploy
```

### Deploy to Other Platforms
- **Netlify**: Connect repo, select `web-version` branch
- **GitHub Pages**: Build and deploy from Actions
- **Self-hosted**: `npm run build` creates `dist/` folder

---

## 🔌 API Endpoints

All endpoints are available at `/api/`:

### Books
```
GET  /api/books              # Get all library books
POST /api/books              # Add a new book
GET  /api/books?catalog=true # Get 99 catalog books
DELETE /api/books?id=...     # Delete a book
```

### Users
```
GET  /api/users              # Get all users
POST /api/users              # Add a new user
DELETE /api/users?id=...     # Delete a user
```

### Loans
```
GET  /api/loans              # Get all loans
POST /api/loans              # Borrow a book
PUT  /api/loans?id=...       # Return a book
DELETE /api/loans?id=...     # Delete a loan
```

---

## 🔮 Future Roadmap

- [ ] User authentication & login
- [ ] Supabase integration for cloud storage
- [ ] Dark/Light theme toggle
- [ ] Email notifications for overdue books
- [ ] Payment processing for fines
- [ ] Book reviews & ratings
- [ ] Admin dashboard with analytics
- [ ] Mobile app version
- [ ] QR code scanning for books
- [ ] Advanced search filters

---

## 📊 Technical Stack

### Web Version
| Component | Technology |
|-----------|------------|
| Framework | React 18.2 |
| Build Tool | Vite 4.3 |
| Styling | Pure CSS + Gradients |
| Deployment | Vercel |
| Backend | Serverless Functions |

### Desktop Version
| Component | Technology |
|-----------|------------|
| Language | Java 21 |
| GUI | JavaFX 25.0.1 |
| Build | Apache Maven |
| Data | JSON (Jackson) |
| Storage | File-based |

---

## 📱 Browser Support (Web Version)

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🆘 Support & Troubleshooting

### Web Version

| Issue | Solution |
|-------|----------|
| Blank page | Clear cache, hard refresh (Ctrl+Shift+R) |
| Data not saving | Check browser console for API errors |
| Slow performance | Check network tab, clear localStorage |
| Books not appearing | Make sure API endpoint is accessible |

### Desktop Version
See **DESKTOP_APP_BUILD.md**

---

## 📄 Documentation

- **README.md** - This file (project overview)
- **README_REACT.md** - React/Vite technical details
- **DESKTOP_APP_BUILD.md** - Desktop app guide

---

## 🎓 Educational Value

This project demonstrates:
- **Desktop Development**: JavaFX architecture, MVC pattern
- **Web Development**: React components, hooks, state management
- **Full-Stack**: Frontend + serverless backend
- **DevOps**: Multi-branch deployment, Vercel hosting
- **UI/UX**: Modern design, animations, responsive layouts
- **Clean Code**: Component-based, modular architecture

---

## 📝 Version History

| Version | Type | Changes |
|---------|------|---------|
| 2.0.0 | Web | React + Vite, modern animations |
| 1.0.0 | Desktop | JavaFX desktop application |

---

## 📞 Contact & Support

- Issues: GitHub Issues
- Questions: Create a discussion
- Contributions: Pull requests welcome!

---

**Version**: 2.0.0 (Web) / 1.0.0 (Desktop)
**Last Updated**: April 16, 2026
**Status**: ✅ Production Ready (Both Versions)
**License**: MIT
