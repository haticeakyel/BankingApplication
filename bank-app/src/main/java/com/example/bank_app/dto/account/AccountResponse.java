package com.example.bank_app.dto.account;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountResponse {
    private String id;
    private String number;
    private String name;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}