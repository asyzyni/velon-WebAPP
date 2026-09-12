package com.velon.service;

import com.velon.dao.UserDAO;
import com.velon.model.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserDAO userDAO, PasswordEncoder passwordEncoder) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
    }

    // ========================
    // REGISTER
    // ========================
    public User register(String name, String email, String password, String role) {
        if (userDAO.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role != null && !role.trim().isEmpty() ? role.toUpperCase() : "USER");

        return userDAO.save(newUser);
    }

    // ========================
    // LOGIN
    // ========================
    public User login(String email, String password) {
        User user = userDAO.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }

        return user;
    }
}
