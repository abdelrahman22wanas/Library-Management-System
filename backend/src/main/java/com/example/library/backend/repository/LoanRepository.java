package com.example.library.backend.repository;

import com.example.library.backend.model.LoanEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<LoanEntity, UUID> {
    List<LoanEntity> findByReturnedDateIsNull();
}
