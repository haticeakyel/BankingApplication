package com.example.bank_app.repository;

import com.example.bank_app.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.fromAcc.id = :accountId OR t.toAcc.id = :accountId ORDER BY t.transactionDate DESC")
    List<Transaction> findByAccountId(@Param("accountId") UUID accountId);

}
