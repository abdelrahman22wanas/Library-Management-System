package com.example.library.backend.repository;

import com.example.library.backend.model.BookEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<BookEntity, UUID> {
}
