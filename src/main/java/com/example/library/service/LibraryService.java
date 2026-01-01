package com.example.library.service;

import com.example.library.model.Book;
import com.example.library.model.FineCalculator;
import com.example.library.model.Loan;
import com.example.library.model.User;
import com.example.library.storage.StorageProvider;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class LibraryService {
    private final StorageProvider storage;
    private final List<Book> books = new ArrayList<>();
    private final List<User> users = new ArrayList<>();
    private final List<Loan> loans = new ArrayList<>();
    private final BigDecimal dailyFineRate = new BigDecimal("1.00");

    public LibraryService(StorageProvider storage) {
        this.storage = storage;
        loadData();
    }

    private void loadData() {
        try {
            books.addAll(storage.loadBooks());
            users.addAll(storage.loadUsers());
            loans.addAll(storage.loadLoans());
            if (books.isEmpty()) {
                books.add(Book.create("Sample Book", "Admin", 3));
                persist();
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load data", e);
        }
    }

    private void persist() {
        try {
            storage.saveBooks(books);
            storage.saveUsers(users);
            storage.saveLoans(loans);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save data", e);
        }
    }

    public List<Book> getBooks() {
        return Collections.unmodifiableList(books);
    }

    public List<User> getUsers() {
        return Collections.unmodifiableList(users);
    }

    public List<Loan> getLoans() {
        return Collections.unmodifiableList(loans);
    }

    public Book addBook(String title, String author, int copies) {
        Book book = Book.create(title, author, copies);
        books.add(book);
        persist();
        return book;
    }

    public User addUser(String name, String email) {
        User user = User.create(name, email);
        users.add(user);
        persist();
        return user;
    }

    public Loan borrowBook(UUID userId, UUID bookId, int loanDays) {
        Book book = findBook(bookId);
        if (!book.isAvailable()) {
            throw new IllegalStateException("No copies available");
        }
        User user = findUser(userId);
        LocalDate today = LocalDate.now();
        LocalDate dueDate = today.plusDays(Math.max(1, loanDays));
        Loan loan = Loan.create(book.getId(), user.getId(), today, dueDate);
        book.decrementAvailable();
        loans.add(loan);
        persist();
        return loan;
    }

    public Loan returnBook(UUID loanId, LocalDate returnDate) {
        Loan loan = findLoan(loanId);
        if (loan.isReturned()) {
            return loan;
        }
        Book book = findBook(loan.getBookId());
        book.incrementAvailable();
        loan.setReturnedDate(returnDate);
        loan.setFineAccrued(FineCalculator.calculate(loan.getDueDate(), returnDate, dailyFineRate));
        persist();
        return loan;
    }

    public List<Loan> getActiveLoans() {
        return loans.stream().filter(l -> !l.isReturned()).toList();
    }

    private Book findBook(UUID id) {
        return books.stream().filter(b -> b.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
    }

    private User findUser(UUID id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Loan findLoan(UUID id) {
        return loans.stream().filter(l -> l.getId().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));
    }

    public Optional<Loan> getActiveLoanForBook(UUID bookId) {
        return loans.stream()
                .filter(l -> l.getBookId().equals(bookId) && !l.isReturned())
                .findFirst();
    }
}
