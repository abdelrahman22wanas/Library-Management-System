package com.example.library.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

public class Loan {
    private UUID id;
    private UUID bookId;
    private UUID userId;
    private LocalDate borrowedDate;
    private LocalDate dueDate;
    private LocalDate returnedDate;
    private BigDecimal fineAccrued;

    public Loan() {
    }

    public Loan(UUID id, UUID bookId, UUID userId, LocalDate borrowedDate, LocalDate dueDate) {
        this.id = id;
        this.bookId = bookId;
        this.userId = userId;
        this.borrowedDate = borrowedDate;
        this.dueDate = dueDate;
        this.fineAccrued = BigDecimal.ZERO;
    }

    public static Loan create(UUID bookId, UUID userId, LocalDate borrowedDate, LocalDate dueDate) {
        return new Loan(UUID.randomUUID(), bookId, userId, borrowedDate, dueDate);
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getBookId() {
        return bookId;
    }

    public void setBookId(UUID bookId) {
        this.bookId = bookId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public LocalDate getBorrowedDate() {
        return borrowedDate;
    }

    public void setBorrowedDate(LocalDate borrowedDate) {
        this.borrowedDate = borrowedDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getReturnedDate() {
        return returnedDate;
    }

    public void setReturnedDate(LocalDate returnedDate) {
        this.returnedDate = returnedDate;
    }

    public BigDecimal getFineAccrued() {
        return fineAccrued;
    }

    public void setFineAccrued(BigDecimal fineAccrued) {
        this.fineAccrued = fineAccrued;
    }

    public boolean isReturned() {
        return returnedDate != null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Loan loan)) return false;
        return Objects.equals(id, loan.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
