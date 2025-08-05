package com.example.bank_app.service.interfaces;


import com.example.bank_app.dto.transaction.TransactionHistoryDto;
import com.example.bank_app.dto.transaction.TransferRequestDto;
import com.example.bank_app.dto.transaction.TransferResponseDto;

import java.util.List;
import java.util.UUID;

public interface ITransactionService {
    TransferResponseDto transferMoney( TransferRequestDto request);
    List<TransactionHistoryDto> getTransactionHistory(UUID userId, UUID accountId);
}