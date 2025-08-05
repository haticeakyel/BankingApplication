package com.example.bank_app.service.interfaces;

import com.example.bank_app.dto.user.LoginRequest;
import com.example.bank_app.dto.user.LoginResponse;
import com.example.bank_app.dto.user.RegisterRequest;
import com.example.bank_app.entity.User;
import org.springframework.http.ResponseEntity;

public interface IUserService {
    ResponseEntity register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}