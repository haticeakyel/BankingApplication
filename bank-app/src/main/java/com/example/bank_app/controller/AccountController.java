package com.example.bank_app.controller;

import com.example.bank_app.dto.account.AccountCreateRequest;
import com.example.bank_app.dto.account.AccountResponse;
import com.example.bank_app.dto.account.AccountUpdateRequest;
import com.example.bank_app.service.interfaces.IAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final IAccountService accountService;

    @PostMapping()
    public ResponseEntity<AccountResponse> createAccount(@RequestBody AccountCreateRequest request, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(accountService.createAccount(userId, request));
    }
    @GetMapping()
    public ResponseEntity<List<AccountResponse>> getAllAccounts(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(accountService.getAllAccounts(userId));
    }


    @PostMapping("/search")
    public ResponseEntity<List<AccountResponse>> searchAccount(
            @RequestParam(required = false, defaultValue = "") String number,
            @RequestParam(required = false, defaultValue = "") String name,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(accountService.searchAccounts(userId, number, name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable UUID id, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(accountService.getAccount(userId, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(@PathVariable UUID id, @RequestBody AccountUpdateRequest request, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(accountService.updateAccount(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable UUID id, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        accountService.deleteAccount(userId, id);
        return ResponseEntity.noContent().build();
    }
}
