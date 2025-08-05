package com.example.bank_app.service.impl;

import com.example.bank_app.dto.user.LoginRequest;
import com.example.bank_app.dto.user.LoginResponse;
import com.example.bank_app.dto.user.RegisterRequest;
import com.example.bank_app.entity.User;
import com.example.bank_app.repository.UserRepository;
import com.example.bank_app.service.interfaces.IUserService;
import com.example.bank_app.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public ResponseEntity<String> register(RegisterRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        String email = request.getEmail();

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("User is already exist");
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername(username);
        user.setPassword(encoder.encode(password));
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return ResponseEntity.ok("User registered");
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getId().toString());
        return new LoginResponse(token);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            UUID userId = UUID.fromString(username);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getId().toString())
                    .password(user.getPassword())
                    .authorities(new ArrayList<>())
                    .build();
        } catch (IllegalArgumentException e) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getId().toString())
                    .password(user.getPassword())
                    .authorities(new ArrayList<>())
                    .build();
        }
    }
}