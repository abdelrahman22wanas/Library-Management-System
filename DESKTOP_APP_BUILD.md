# Library Management System - Desktop Application Build Guide

## ✅ Build Complete

Your Library Management System has been successfully packaged as a standalone desktop application!

### 📦 Files Created

**Main Executable JAR:**
- Location: `target/LibraryManagement.jar` (12 MB)
- Includes: All Java code, dependencies, and embedded FXML/image resources

**Launcher Script:**
- Location: `LibraryManagement.bat` (Windows batch file)
- Function: Automatically launches the application with proper Java/JavaFX settings

### 🚀 How to Run

#### Option 1: Double-click the Batch File
```
LibraryManagement.bat
```
This is the easiest method - just double-click and the app launches!

#### Option 2: Command Line
```powershell
java --module-path C:\javafx-sdk-25.0.1\lib --add-modules javafx.controls,javafx.fxml -jar target/LibraryManagement.jar
```

### 📋 System Requirements

- **Java 21+** installed (check: `java -version`)
- **JavaFX SDK 25.0.1** installed at `C:\javafx-sdk-25.0.1`
- **Windows** (batch file is Windows-specific)

### 📂 Application Files

The application loads and saves data in the `data/` directory:
- `data/books.json` - All 99 books with authors
- `data/users.json` - User records
- `data/loans.json` - Borrow/return transaction history

**Note:** These are created automatically on first run and persist between sessions.

### 🎨 Application Features

✅ **99 Pre-loaded Books** with titles and authors from CSV
✅ **User Management** - Add and track library users
✅ **Borrow/Return System** - Track book loans
✅ **Fine Calculation** - Auto-calculate late fees
✅ **Responsive UI** - Resizable window that adapts to all screen sizes
✅ **Professional Dark Theme** - Modern dark interface with blue accents
✅ **Book Icon** - Custom application icon in window title bar

### 🔧 Technical Details

**Build Tool:** Apache Maven
**Framework:** JavaFX 25.0.1 (GUI)
**Data Storage:** JSON files (File-based persistence)
**Language:** Java 21
**Database:** Jackson (JSON serialization/deserialization)

### 📦 Distribution

The `target/LibraryManagement.jar` file can be:
- Shared directly to other users
- Placed on a network drive
- Packaged into an installer (using tools like NSIS or WiX)
- Run on any machine with Java 21 and JavaFX SDK installed

### ⚙️ Troubleshooting

**Error: "Java is not installed"**
→ Install Java 21 from https://www.oracle.com/java/technologies/

**Error: "JavaFX SDK not found"**
→ Ensure JavaFX SDK 25.0.1 is installed at C:\javafx-sdk-25.0.1

**Error: Module not found**
→ Run the batch file with administrator privileges

### 📊 File Structure

```
Library Management System/
├── target/
│   └── LibraryManagement.jar          ← Standalone executable
├── data/
│   ├── books.json                     ← 99 books (auto-created)
│   ├── users.json                     ← Users (auto-created)
│   └── loans.json                     ← Loans (auto-created)
├── src/                               ← Source code
├── LibraryManagement.bat              ← Windows launcher
├── pom.xml                            ← Maven configuration
└── books.csv                          ← Original book data
```

### 🎯 Next Steps

1. Copy the JAR to distribute to others
2. Create shortcuts to `LibraryManagement.bat` for easy access
3. Optional: Create a professional installer using NSIS or WiX

---

**Build Date:** January 1, 2026
**Version:** 1.0.0
