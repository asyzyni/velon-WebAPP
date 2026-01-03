package com.velon.controller.base;

import org.springframework.http.ResponseEntity;

public abstract class BaseController {
    protected ResponseEntity<?> ok(Object data) {
        return ResponseEntity.ok(data);
    }

    protected ResponseEntity<?> bad(String message) {
        return ResponseEntity.badRequest().body(message);
    }
}
