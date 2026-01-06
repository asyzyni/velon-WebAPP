package com.velon.service;

import org.springframework.stereotype.Service;
import com.velon.dao.UserDAO;
import com.velon.model.entity.User;

@Service
public class AuthService {

    private final UserDAO userDAO;

    public AuthService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    // ========================
    // REGISTER
    // ========================
    public User register(String name, String email, String password) {

        // cek email sudah ada
        User existing = userDAO.findByEmail(email);
        if (existing != null) {
            throw new RuntimeException("Email already registered");
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(password); // NOTE: plain dulu

        userDAO.register(newUser);
        return newUser;
    }

    // ========================
    // LOGIN
    // ========================
    public User login(String email, String password) {

        User user = userDAO.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }
}
