package com.example.library.common.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class LoanDTO {
    private UUID id;
    private UUID bookId;
    private UUID userId;
    private LocalDate borrowedDate;
    private LocalDate dueDate;
    private LocalDate returnedDate;
    private BigDecimal fineAccrued;

    public LoanDTO() {
    }

    public LoanDTO(UUID id, UUID bookId, UUID userId, LocalDate borrowedDate,
                   LocalDate dueDate, LocalDate returnedDate, BigDecimal fineAccrued) {
        this.id = id;
        this.bookId = bookId;
        this.userId = userId;
        this.borrowedDate = borrowedDate;
        this.dueDate = dueDate;
        this.returnedDate = returnedDate;
        this.fineAccrued = fineAccrued;
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
}
