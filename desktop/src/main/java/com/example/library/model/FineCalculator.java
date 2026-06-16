package com.example.library.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public final class FineCalculator {
    private FineCalculator() {
    }

    public static BigDecimal calculate(LocalDate dueDate, LocalDate returnedDate, BigDecimal dailyRate) {
        if (dueDate == null || returnedDate == null) {
            return BigDecimal.ZERO;
        }
        if (!returnedDate.isAfter(dueDate)) {
            return BigDecimal.ZERO;
        }
        long overdueDays = dueDate.until(returnedDate).getDays();
        BigDecimal fine = dailyRate.multiply(BigDecimal.valueOf(overdueDays));
        return fine.setScale(2, RoundingMode.HALF_UP);
    }
}
