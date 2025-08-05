package com.example.bank_app.dto.account;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountUpdateRequest {
    private String name;
    private String number;
    private BigDecimal balance;
}