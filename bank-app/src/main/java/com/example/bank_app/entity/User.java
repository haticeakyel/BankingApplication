package com.example.bank_app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private UUID id;
    @NotBlank
    @Size(min = 4)
    private String username;
    @NotBlank
    @Size(min = 6)
    private String password;
    @NotBlank
    @Email
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Account> accounts;
}
