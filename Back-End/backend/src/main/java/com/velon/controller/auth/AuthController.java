package com.velon.controller.auth;

import org.springframework.web.bind.annotation.*;
import com.velon.dao.UserDAO;
import com.velon.model.entity.User;
import com.velon.model.dto.LoginRequest;
import com.velon.model.dto.RegisterRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserDAO userDAO = new UserDAO();

    @GetMapping
    public String authInfo() {
        return "Auth API - Use POST /auth/register or POST /auth/login with JSON body";
    }

    // Register - Now accepts JSON
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        User user = new User(request.getName(), request.getEmail(), request.getPassword());
        boolean success = userDAO.register(user);

        if (success) {
            return "Registration successful!";
        } else {
            return "Registration failed.";
        }
    }

    // Login - Now accepts JSON
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        User user = userDAO.findbyEmail(request.getEmail(), request.getPassword());

        if (user == null) {
            return "Email tidak ditemukan";
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return "Password salah";
        }

        return "Login successful!, welcome " + user.getName();
    }
} 
