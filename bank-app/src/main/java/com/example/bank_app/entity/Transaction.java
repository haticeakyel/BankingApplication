package com.example.bank_app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.transaction.TransactionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    private Account fromAcc;
    @ManyToOne
    private Account toAcc;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    public enum TransactionStatus {
        PENDING,
        SUCCESS,
        FAILED
    }
}

