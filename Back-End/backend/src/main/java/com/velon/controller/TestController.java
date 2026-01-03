package com.velon.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Velon Car Rent API! Available endpoints: /test, /auth/register, /auth/login";
    }

    @GetMapping("/test")
    public String testEndpoint() {
        return "Test successful!";
    }
}
