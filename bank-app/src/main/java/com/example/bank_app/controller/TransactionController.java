package com.example.bank_app.controller;

import com.example.bank_app.dto.transaction.TransactionHistoryDto;
import com.example.bank_app.dto.transaction.TransferRequestDto;
import com.example.bank_app.dto.transaction.TransferResponseDto;
import com.example.bank_app.service.interfaces.ITransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    @Autowired
    private final ITransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<TransferResponseDto> transferMoney(
            @Valid @RequestBody TransferRequestDto request) {

        TransferResponseDto response = transactionService.transferMoney(request);

        if ("SUCCESS".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionHistoryDto>> getTransactionHistory(
            @PathVariable UUID accountId,
            Authentication authentication) {
        String userIdStr = authentication.getName();
        UUID userId = UUID.fromString(userIdStr);

        System.out.println("User ID from JWT: " + userId);
        List<TransactionHistoryDto> transactions = transactionService.getTransactionHistory(userId, accountId);
        return ResponseEntity.ok(transactions);
    }
}