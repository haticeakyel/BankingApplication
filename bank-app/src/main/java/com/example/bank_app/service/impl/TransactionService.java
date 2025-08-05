package com.example.bank_app.service.impl;

import com.example.bank_app.dto.transaction.TransactionHistoryDto;
import com.example.bank_app.dto.transaction.TransferRequestDto;
import com.example.bank_app.dto.transaction.TransferResponseDto;
import com.example.bank_app.entity.Account;
import com.example.bank_app.entity.Transaction;
import com.example.bank_app.repository.AccountRepository;
import com.example.bank_app.repository.TransactionRepository;
import com.example.bank_app.service.interfaces.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public TransferResponseDto transferMoney(TransferRequestDto request) {
        try {
            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Transfer amount must be greater than zero");
            }

            Account fromAccount = accountRepository.findById(UUID.fromString(request.getFromAccountId()))
                    .orElseThrow(() -> new RuntimeException("Source account not found"));

            Account toAccount = accountRepository.findById(UUID.fromString(request.getToAccountId()))
                    .orElseThrow(() -> new RuntimeException("Destination account not found"));

            if (fromAccount.getId().equals(toAccount.getId())) {
                throw new RuntimeException("Cannot transfer to the same account");
            }
            if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("Insufficient funds in source account");
            }

            Transaction transaction = new Transaction();
            transaction.setFromAcc(fromAccount);
            transaction.setToAcc(toAccount);
            transaction.setAmount(request.getAmount());
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setStatus(Transaction.TransactionStatus.PENDING);
            transaction = transactionRepository.save(transaction);

            try {
                fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
                toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
                fromAccount.setUpdatedAt(LocalDateTime.now());
                toAccount.setUpdatedAt(LocalDateTime.now());
                accountRepository.save(fromAccount);
                accountRepository.save(toAccount);
                transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
                transaction = transactionRepository.save(transaction);

                return toTransferResponse(transaction, "SUCCESS", "Transfer completed successfully");

            } catch (Exception e) {
                transaction.setStatus(Transaction.TransactionStatus.FAILED);
                transactionRepository.save(transaction);

                throw new RuntimeException("Transfer failed: " + e.getMessage());
            }

        } catch (Exception e) {
            TransferResponseDto response = new TransferResponseDto();
            response.setStatus("FAILED");
            response.setMessage(e.getMessage());
            return response;
        }
    }

    @Override
    public List<TransactionHistoryDto> getTransactionHistory(UUID userId, UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .filter(a -> a.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        List<Transaction> transactions = transactionRepository.findByAccountId(accountId);

        return transactions.stream()
                .map(transaction -> toTransactionHistoryDto(transaction, accountId))
                .collect(Collectors.toList());
    }

    private TransferResponseDto toTransferResponse(Transaction transaction, String status, String message) {
        TransferResponseDto response = new TransferResponseDto();
        response.setTransactionId(transaction.getId());
        response.setStatus(status);
        response.setMessage(message);
        response.setAmount(transaction.getAmount());
        response.setFromAccountNumber(transaction.getFromAcc().getNumber());
        response.setToAccountNumber(transaction.getToAcc().getNumber());
        return response;
    }

    private TransactionHistoryDto toTransactionHistoryDto(Transaction transaction, UUID accountId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        String type = transaction.getFromAcc().getId().equals(accountId) ? "SENT" : "RECEIVED";

        TransactionHistoryDto dto = new TransactionHistoryDto();
        dto.setId(transaction.getId());
        dto.setFromAccountNumber(transaction.getFromAcc().getNumber());
        dto.setToAccountNumber(transaction.getToAcc().getNumber());
        dto.setAmount(transaction.getAmount());
        dto.setTransactionDate(transaction.getTransactionDate().format(formatter));
        dto.setStatus(transaction.getStatus().toString());
        dto.setType(type);
        return dto;
    }
}