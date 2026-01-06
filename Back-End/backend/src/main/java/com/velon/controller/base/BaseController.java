package com.velon.controller.base;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173" )
public abstract class BaseController {
    protected ResponseEntity<?> ok(Object data) {
        return ResponseEntity.ok(data);
    }

    protected ResponseEntity<?> bad(String message) {
        return ResponseEntity.badRequest().body(message);
    }
}
