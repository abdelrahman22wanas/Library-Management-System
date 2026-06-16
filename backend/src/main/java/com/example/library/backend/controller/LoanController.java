package com.example.library.backend.controller;

import com.example.library.backend.mapper.LoanMapper;
import com.example.library.backend.service.LibraryService;
import com.example.library.common.dto.LoanDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/loans")
@Tag(name = "Loans", description = "Loan management endpoints")
public class LoanController {

    private final LibraryService libraryService;
    private final LoanMapper loanMapper;

    public LoanController(LibraryService libraryService, LoanMapper loanMapper) {
        this.libraryService = libraryService;
        this.loanMapper = loanMapper;
    }

    @GetMapping
    @Operation(summary = "Get all loans")
    public ResponseEntity<List<LoanDTO>> getAllLoans() {
        List<LoanDTO> loans = libraryService.getLoans().stream()
                .map(loanMapper::toDto)
                .toList();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/active")
    @Operation(summary = "Get active (unreturned) loans")
    public ResponseEntity<List<LoanDTO>> getActiveLoans() {
        List<LoanDTO> loans = libraryService.getActiveLoans().stream()
                .map(loanMapper::toDto)
                .toList();
        return ResponseEntity.ok(loans);
    }

    @PostMapping("/borrow")
    @Operation(summary = "Borrow a book")
    public ResponseEntity<LoanDTO> borrowBook(
            @RequestParam UUID userId,
            @RequestParam UUID bookId,
            @RequestParam @Min(1) int loanDays) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(loanMapper.toDto(libraryService.borrowBook(userId, bookId, loanDays)));
    }

    @PostMapping("/return")
    @Operation(summary = "Return a borrowed book")
    public ResponseEntity<LoanDTO> returnBook(
            @RequestParam UUID loanId,
            @RequestParam(required = false) LocalDate returnDate) {
        LocalDate date = returnDate != null ? returnDate : LocalDate.now();
        return ResponseEntity.ok(loanMapper.toDto(libraryService.returnBook(loanId, date)));
    }
}
