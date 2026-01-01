# Library Management System (JavaFX + Maven)

A modern, responsive desktop application for managing a library's book collection, user accounts, and loan transactions with automatic fine calculation.

## ✨ Features
- **📚 Manage 99 Pre-loaded Books** - All books with titles and authors from CSV
- **👥 User Management** - Add and track library users
- **📖 Borrow & Return System** - Track book loans with due dates
- **💰 Automatic Fine Calculation** - $1.00 per overdue day (configurable)
- **📊 Responsive UI** - Fully resizable window that adapts to any screen size
- **🎨 Modern Dark Theme** - Professional dark interface with blue accents
- **💾 File Persistence** - JSON-based data storage (easy to migrate to database)
- **🖼️ Custom App Icon** - Book icon displayed in window title bar

## 📋 Prerequisites
- **JDK 21+** (check: `java -version`)
- **Maven 3.9+** (check: `mvn -version`)
- **JavaFX SDK 25.0.1** unpacked at `C:\javafx-sdk-25.0.1`

## 🚀 Quick Start

### Option 1: Run as Desktop Application (Easiest)
```powershell
# Double-click:
LibraryManagement.bat
```
Or from PowerShell:
```powershell
java --module-path C:\javafx-sdk-25.0.1\lib --add-modules javafx.controls,javafx.fxml -jar target/LibraryManagement.jar
```

### Option 2: Run During Development
```powershell
mvn javafx:run
```

### Option 3: Build and Run Manually
```powershell
mvn clean package
# Then run the JAR (12 MB standalone executable)
java --module-path C:\javafx-sdk-25.0.1\lib --add-modules javafx.controls,javafx.fxml -jar target/LibraryManagement.jar
```

## 📁 Project Structure
```
Library Management System/
├── src/main/java/com/example/library/
│   ├── LibraryApp.java                    # JavaFX entry point with app icon
│   ├── ui/
│   │   └── LibraryController.java         # FXML controller binding UI to service
│   ├── model/
│   │   ├── Book.java                      # Book entity with copy tracking
│   │   ├── User.java                      # User entity
│   │   ├── Loan.java                      # Loan transaction record
│   │   └── FineCalculator.java            # Fine calculation utility
│   ├── service/
│   │   └── LibraryService.java            # Core business logic (add, borrow, return, fine)
│   └── storage/
│       ├── StorageProvider.java           # Storage abstraction interface
│       └── FileStorageProvider.java       # JSON file persistence
│
├── src/main/resources/com/example/library/
│   ├── layout.fxml                        # Responsive UI layout (3 tabs)
│   └── book-icon.jpg                      # Application icon
│
├── data/
│   ├── books.json                         # 99 books (auto-created on first run)
│   ├── users.json                         # User records
│   └── loans.json                         # Loan transaction history
│
├── target/
│   └── LibraryManagement.jar              # Standalone executable (12 MB)
│
├── pom.xml                                # Maven configuration with plugins
├── LibraryManagement.bat                  # Windows launcher
├── books.csv                              # Original book data source
├── DESKTOP_APP_BUILD.md                   # Desktop app build documentation
└── README.md                              # This file
```

## 🎯 Usage

### Adding Books
1. Navigate to **Books** tab
2. Enter Title, Author, and Copies
3. Click **Add Book**

### Adding Users
1. Navigate to **Users** tab
2. Enter Name and Email
3. Click **Add User**

### Borrowing Books
1. Navigate to **Loans** tab → **Borrow** section
2. Select User and Book from dropdowns
3. Enter loan duration (days)
4. Click **Borrow**

### Returning Books
1. Navigate to **Loans** tab → **Return** section
2. Select active loan from dropdown
3. Choose return date
4. Click **Return** (fine auto-calculated if overdue)

## 🔧 Configuration

### Change Fine Rate
Edit `src/main/java/com/example/library/service/LibraryService.java`:
```java
private static final BigDecimal dailyFineRate = new BigDecimal("1.00"); // Change this value
```

### Window Size
Default: 1200×800px (resizable, minimum 900×600px)

## 💾 Data Storage

### JSON-Based Persistence
All data stored in `data/` directory as JSON files:
- **books.json** - All 99 books with metadata
- **users.json** - Library users
- **loans.json** - Borrow/return transactions

### Swap to Database
The `StorageProvider` interface allows easy replacement:
1. Create `DatabaseStorageProvider` implementing `StorageProvider`
2. Update `LibraryApp.java` to use new implementation instead of `FileStorageProvider`
3. No changes needed to business logic

## 📦 Distribution

The standalone JAR (`target/LibraryManagement.jar`) can be:
- ✅ Shared directly with other users
- ✅ Placed on network drives
- ✅ Packaged into an installer (NSIS/WiX)
- ✅ Run on any machine with Java 21 + JavaFX SDK

## 🛠️ Build & Development

### Build Desktop App
```powershell
mvn clean package
```
Creates: `target/LibraryManagement.jar` (standalone executable)

### Clean All Data
```powershell
Remove-Item -Path data -Recurse -Force
```
Data recreates on next run with sample books.

### Development Mode
```powershell
mvn javafx:run
```
Compiles and runs immediately with hot-reload capability.

## 🎨 UI Components

### Books Tab
- TableView showing all books (Title, Author, Available, Total)
- Input form to add new books
- Responsive table that grows with window size

### Users Tab
- TableView showing all users (Name, Email)
- Input form to add new users
- Auto-expanding columns

### Loans Tab
- TableView showing all loan history
- **Borrow Section** - ComboBoxes for user/book selection, days input
- **Return Section** - Active loan selector, return date picker
- Auto-calculated fines for overdue books

## ⚙️ Technical Details

**Language:** Java 21
**GUI Framework:** JavaFX 25.0.1
**Build Tool:** Apache Maven
**Data Format:** JSON (Jackson 2.17.1)
**Date/Time:** Java Time API (LocalDate, LocalDateTime)
**Architecture:** Service Layer Pattern with Storage Abstraction

## 📝 Notes

- **Initial Window:** 1200×800 (resizable, min 900×600)
- **Fine Calculation:** Triggered at return time, no penalties until return
- **Data Persistence:** Automatic save after each operation
- **Backward Compatibility:** Old JSON formats handled gracefully via Jackson annotations

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Java not found" | Install Java 21+ and add to PATH |
| "JavaFX not found" | Ensure `C:\javafx-sdk-25.0.1` exists |
| "Module javafx not found" | Use `--module-path` and `--add-modules` flags |
| "Port already in use" | App uses file-based storage, no port conflicts |
| "Data won't save" | Ensure `data/` directory is writable |

## 📄 License & Notes

Built with JavaFX, Maven, and Jackson for a complete library management solution.
Ready for production use or educational purposes.
