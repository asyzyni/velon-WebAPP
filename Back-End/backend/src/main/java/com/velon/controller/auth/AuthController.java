package com.velon.controller.auth;

import org.springframework.web.bind.annotation.*;
import com.velon.dao.UserDAO;
import com.velon.model.entity.User;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserDAO userDAO = new UserDAO();

    @GetMapping
    public String authInfo() {
        return "Auth API - Use POST /auth/register or POST /auth/login with form data";
    }

    // Register
    @PostMapping("/register")
    public String register(
        @RequestParam String name,
        @RequestParam String email,
        @RequestParam String password
    ) {
        User user = new User(name, email, password);
        boolean success = userDAO.register(user);

        if (success) {
            return "Registration successful!";
        } else {
            return "Registration failed.";
        }
    }

    // Login
    @PostMapping("/login")
    public String login(
        @RequestParam String email, 
        @RequestParam String password
    ) {
        User user = userDAO.findbyEmail(email, password);
        
        if (user == null) {
            return "Email tidak ditemukan";
        }

        if (!user.getPassword().equals(password)) {
            return "Password salah";
        }

        return "Login successful!, welcome " + user.getName();
    }
} 
