package com.velon.controller.auth;

import com.velon.controller.base.BaseController;
import com.velon.dao.UserDAO;
import com.velon.model.entity.User;
import com.velon.model.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController extends BaseController {

    private final UserDAO userDAO;

    public AuthController(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    // =====================
    // REGISTER
    // =====================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email & password required");
        }

        // default role USER kalau kosong
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        userDAO.register(user);
        return ResponseEntity.ok("REGISTER SUCCESS");
    }

    // =====================
    // LOGIN
    // =====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email & password required");
        }

        User user = userDAO.findByEmail(req.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        if (!user.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(401).body("Wrong password");
        }

        // RESPONSE AMAN (PASSWORD TIDAK DIKIRIM)
        Map<String, Object> res = new HashMap<>();
        res.put("id", user.getId());
        res.put("name", user.getName());
        res.put("email", user.getEmail());
        res.put("role", user.getRole());

        return ResponseEntity.ok(res);
    }
}
