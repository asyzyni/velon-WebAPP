package com.velon.controller.auth;

import com.velon.dao.UserDAO;
import com.velon.model.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserDAO userDAO;

    public AuthController(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    // =====================
    // REGISTER
    // =====================
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userDAO.register(user);
        return ResponseEntity.ok("REGISTER SUCCESS");
    }

    // =====================
    // LOGIN
    // =====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userDAO.findByEmail(req.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        if (!user.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(401).body("Wrong password");
        }

        return ResponseEntity.ok(user);
    }
}
