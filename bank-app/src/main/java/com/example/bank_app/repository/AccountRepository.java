package com.example.bank_app.repository;

import com.example.bank_app.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByUserIdAndNumberContainingIgnoreCaseAndNameContainingIgnoreCase(UUID userId, String number, String name);
    List<Account> findByUserId(UUID userId);

}
