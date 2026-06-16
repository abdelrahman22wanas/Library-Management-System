package com.example.library.backend.service;

import com.example.library.backend.model.BookEntity;
import com.example.library.backend.model.LoanEntity;
import com.example.library.backend.model.UserEntity;
import com.example.library.backend.repository.BookRepository;
import com.example.library.backend.repository.LoanRepository;
import com.example.library.backend.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LibraryService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final BigDecimal dailyFineRate = new BigDecimal("1.00");

    public LibraryService(BookRepository bookRepository, UserRepository userRepository,
                          LoanRepository loanRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
    }

    @Transactional(readOnly = true)
    public List<BookEntity> getBooks() {
        return bookRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<UserEntity> getUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<LoanEntity> getLoans() {
        return loanRepository.findAll();
    }

    public BookEntity addBook(String title, String author, int copies) {
        int safeCopies = Math.max(1, copies);
        BookEntity book = new BookEntity(UUID.randomUUID(), title, author, safeCopies, safeCopies);
        return bookRepository.save(book);
    }

    public UserEntity addUser(String name, String email) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with email " + email + " already exists");
        }
        UserEntity user = new UserEntity(UUID.randomUUID(), name, email);
        return userRepository.save(user);
    }

    public LoanEntity borrowBook(UUID userId, UUID bookId, int loanDays) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + bookId));
        if (!book.isAvailable()) {
            throw new IllegalStateException("No copies available for book: " + book.getTitle());
        }
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        LocalDate today = LocalDate.now();
        LocalDate dueDate = today.plusDays(Math.max(1, loanDays));
        LoanEntity loan = new LoanEntity(UUID.randomUUID(), book.getId(), user.getId(),
                today, dueDate, null, BigDecimal.ZERO);
        book.decrementAvailable();
        bookRepository.save(book);
        return loanRepository.save(loan);
    }

    public LoanEntity returnBook(UUID loanId, LocalDate returnDate) {
        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found: " + loanId));
        if (loan.isReturned()) {
            return loan;
        }
        BookEntity book = bookRepository.findById(loan.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + loan.getBookId()));
        book.incrementAvailable();
        loan.setReturnedDate(returnDate);
        loan.setFineAccrued(calculateFine(loan.getDueDate(), returnDate));
        bookRepository.save(book);
        return loanRepository.save(loan);
    }

    @Transactional(readOnly = true)
    public List<LoanEntity> getActiveLoans() {
        return loanRepository.findByReturnedDateIsNull();
    }

    private BigDecimal calculateFine(LocalDate dueDate, LocalDate returnedDate) {
        if (dueDate == null || returnedDate == null || !returnedDate.isAfter(dueDate)) {
            return BigDecimal.ZERO;
        }
        long overdueDays = dueDate.until(returnedDate).getDays();
        return dailyFineRate.multiply(BigDecimal.valueOf(overdueDays))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
