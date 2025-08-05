package com.example.bank_app.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransferResponseDto {
    private Long transactionId;
    private String status;
    private String message;
    private BigDecimal amount;
    private String fromAccountNumber;
    private String toAccountNumber;
}