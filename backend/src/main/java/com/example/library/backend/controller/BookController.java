package com.example.library.backend.controller;

import com.example.library.backend.mapper.BookMapper;
import com.example.library.backend.service.LibraryService;
import com.example.library.common.dto.BookDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "Book management endpoints")
public class BookController {

    private final LibraryService libraryService;
    private final BookMapper bookMapper;

    public BookController(LibraryService libraryService, BookMapper bookMapper) {
        this.libraryService = libraryService;
        this.bookMapper = bookMapper;
    }

    @GetMapping
    @Operation(summary = "Get all books")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<BookDTO> books = libraryService.getBooks().stream()
                .map(bookMapper::toDto)
                .toList();
        return ResponseEntity.ok(books);
    }

    @PostMapping
    @Operation(summary = "Add a new book")
    public ResponseEntity<BookDTO> addBook(
            @RequestParam @NotBlank String title,
            @RequestParam @NotBlank String author,
            @RequestParam @Min(1) int copies) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookMapper.toDto(libraryService.addBook(title, author, copies)));
    }
}
