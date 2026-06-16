# Library Management System

Multi-module library management system with a Spring Boot backend (PostgreSQL)
and a JavaFX desktop client.

## Modules

| Module | Description |
|--------|-------------|
| `backend/` | Spring Boot REST API (port 8080) with JPA + PostgreSQL |
| `common/` | Shared DTOs used by backend and desktop-client |
| `desktop/` | Standalone JavaFX desktop app with JSON file storage |
| `desktop-client/` | JavaFX desktop app connecting to the backend REST API |

## Quick Start

### Backend (Docker)

```bash
docker compose up --build
```

This starts PostgreSQL and the backend API on port 8080.

API docs: http://localhost:8080/swagger-ui.html

### Backend (Development)

```bash
# Start PostgreSQL manually, then:
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Desktop (Standalone — no backend needed)

```powershell
cd desktop
mvn javafx:run
# Or double-click: desktop/LibraryManagement.bat
```

### Desktop Client (connects to backend)

```powershell
cd desktop-client
mvn javafx:run
```

### Build All Modules

```bash
mvn clean package
```

### Build Individual Module

```bash
mvn clean package -pl backend -am
mvn clean package -pl desktop -am
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books` | List all books |
| POST | `/api/books?title=&author=&copies=` | Add a book |
| GET | `/api/users` | List all users |
| POST | `/api/users?name=&email=` | Add a user |
| GET | `/api/loans` | List all loans |
| GET | `/api/loans/active` | List active (unreturned) loans |
| POST | `/api/loans/borrow?userId=&bookId=&loanDays=` | Borrow a book |
| POST | `/api/loans/return?loanId=&returnDate=` | Return a book |

## Data Migration

On first startup, the backend checks if the database is empty and migrates any
existing data from `data/books.json`, `data/users.json`, and `data/loans.json`
into PostgreSQL automatically.

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.4, Spring Data JPA, PostgreSQL, Hibernate
- **Desktop:** JavaFX 25, Jackson 2.17
- **Build:** Maven multi-module
- **Deployment:** Docker, Docker Compose
