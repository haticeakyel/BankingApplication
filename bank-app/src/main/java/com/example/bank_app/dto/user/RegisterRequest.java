package com.example.bank_app.dto.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterRequest {

    @NotEmpty(message = "Username can't be empty")
    private String username;

    @NotEmpty(message = "Password can't be empty")
    private String password;

    @NotEmpty(message = "Email can't be empty")
    private String email;

}
