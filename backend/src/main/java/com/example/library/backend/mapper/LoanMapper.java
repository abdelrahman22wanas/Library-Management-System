package com.example.library.backend.mapper;

import com.example.library.backend.model.LoanEntity;
import com.example.library.common.dto.LoanDTO;
import org.springframework.stereotype.Component;

@Component
public class LoanMapper {

    public LoanDTO toDto(LoanEntity entity) {
        return new LoanDTO(
                entity.getId(),
                entity.getBookId(),
                entity.getUserId(),
                entity.getBorrowedDate(),
                entity.getDueDate(),
                entity.getReturnedDate(),
                entity.getFineAccrued()
        );
    }

    public LoanEntity toEntity(LoanDTO dto) {
        return new LoanEntity(
                dto.getId(),
                dto.getBookId(),
                dto.getUserId(),
                dto.getBorrowedDate(),
                dto.getDueDate(),
                dto.getReturnedDate(),
                dto.getFineAccrued()
        );
    }
}
