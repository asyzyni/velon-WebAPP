package com.velon.controller.auth;

import com.velon.controller.base.BaseController;
import com.velon.model.dto.LoginRequest;
import com.velon.model.dto.RegisterRequest;
import com.velon.model.entity.User;
import com.velon.service.AuthService;
import com.velon.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController extends BaseController {

    private final AuthService authService;
    private final SessionService sessionService;

    public AuthController(AuthService authService, SessionService sessionService) {
        this.authService = authService;
        this.sessionService = sessionService;
    }

    // =====================
    // REGISTER
    // =====================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        if (req.getEmail() == null || req.getPassword() == null || req.getName() == null) {
            return bad("Name, email & password required");
        }

        try {
            authService.register(req.getName(), req.getEmail(), req.getPassword(), req.getRole());
            return ok("REGISTER SUCCESS");
        } catch (IllegalArgumentException e) {
            return bad(e.getMessage());
        }
    }

    // =====================
    // LOGIN
    // =====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        if (req.getEmail() == null || req.getPassword() == null) {
            return bad("Email & password required");
        }

        try {
            User user = authService.login(req.getEmail(), req.getPassword());
            String token = sessionService.createSession(user);

            // RESPONSE AMAN (PASSWORD TIDAK DIKIRIM)
            Map<String, Object> res = new HashMap<>();
            res.put("id", user.getId());
            res.put("name", user.getName());
            res.put("email", user.getEmail());
            res.put("role", user.getRole());
            res.put("token", token);

            return ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
