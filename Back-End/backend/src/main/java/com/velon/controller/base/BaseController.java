package com.velon.controller.base;

import org.springframework.http.ResponseEntity;

public abstract class BaseController {
    protected ResponseEntity<?> success(Object data) {
        return ResponseEntity.ok(data);
    }
}
