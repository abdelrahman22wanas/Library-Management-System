package com.example.library.backend.mapper;

import com.example.library.backend.model.BookEntity;
import com.example.library.common.dto.BookDTO;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public BookDTO toDto(BookEntity entity) {
        return new BookDTO(
                entity.getId(),
                entity.getTitle(),
                entity.getAuthor(),
                entity.getTotalCopies(),
                entity.getAvailableCopies()
        );
    }

    public BookEntity toEntity(BookDTO dto) {
        return new BookEntity(
                dto.getId(),
                dto.getTitle(),
                dto.getAuthor(),
                dto.getTotalCopies(),
                dto.getAvailableCopies()
        );
    }
}
