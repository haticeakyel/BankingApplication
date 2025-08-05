package com.example.bank_app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    private UUID id;
    @NotBlank
    private String number;
    @NotBlank
    private String name;

    private BigDecimal balance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}