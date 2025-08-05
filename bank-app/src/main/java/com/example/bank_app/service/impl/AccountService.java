package com.example.bank_app.service.impl;

import com.example.bank_app.dto.account.AccountCreateRequest;
import com.example.bank_app.dto.account.AccountResponse;
import com.example.bank_app.dto.account.AccountUpdateRequest;
import com.example.bank_app.entity.Account;
import com.example.bank_app.entity.User;
import com.example.bank_app.repository.AccountRepository;
import com.example.bank_app.repository.UserRepository;
import com.example.bank_app.service.interfaces.IAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public AccountResponse createAccount(UUID userId, AccountCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setId(UUID.randomUUID());
        account.setName(request.getName());
        account.setNumber(request.getNumber());
        account.setBalance(request.getBalance());
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        account.setUser(user);

        return toResponse(accountRepository.save(account));
    }
    @Override
    public List<AccountResponse> getAllAccounts(UUID userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountResponse> searchAccounts(UUID userId, String number, String name) {
        return accountRepository.findByUserIdAndNumberContainingIgnoreCaseAndNameContainingIgnoreCase(
                userId, number, name
        ).stream().map(this::toResponse).collect(Collectors.toList());
    }


    @Override
    public AccountResponse getAccount(UUID userId, UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .filter(a -> a.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        return toResponse(account);
    }

    @Override
    public AccountResponse updateAccount(UUID userId, UUID accountId, AccountUpdateRequest request) {
        Account account = accountRepository.findById(accountId)
                .filter(a -> a.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));
        account.setName((request.getName()));
        account.setNumber(request.getNumber());
        account.setBalance(request.getBalance());
        account.setUpdatedAt(LocalDateTime.now());

        return toResponse(accountRepository.save(account));
    }

    @Override
    public void deleteAccount(UUID userId, UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .filter(a -> a.getUser().getId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));

        accountRepository.delete(account);
    }

    private AccountResponse toResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId().toString());
        response.setName(account.getName());
        response.setNumber(account.getNumber());
        response.setBalance(account.getBalance());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        return response;
    }
}
