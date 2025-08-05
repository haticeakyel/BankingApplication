package com.example.bank_app.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryDto {
    private Long id;
    private String fromAccountNumber;
    private String toAccountNumber;
    private BigDecimal amount;
    private String transactionDate;
    private String status;
    private String type; // "SENT" or "RECEIVED"
}