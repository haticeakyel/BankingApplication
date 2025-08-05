package com.example.bank_app.service.interfaces;

import com.example.bank_app.dto.account.AccountCreateRequest;
import com.example.bank_app.dto.account.AccountResponse;
import com.example.bank_app.dto.account.AccountUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface IAccountService {
    AccountResponse createAccount(UUID userId, AccountCreateRequest request);
    List<AccountResponse> getAllAccounts(UUID userId);
    List<AccountResponse> searchAccounts(UUID userId, String number, String name);
    AccountResponse getAccount(UUID userId, UUID accountId);
    AccountResponse updateAccount(UUID userId, UUID accountId, AccountUpdateRequest request);
    void deleteAccount(UUID userId, UUID accountId);
}
