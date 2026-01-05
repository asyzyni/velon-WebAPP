package com.velon.controller.payment;

import com.velon.service.PaymentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder.In;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody Map<String, String> body) {
        Integer bookingId = Integer.valueOf(body.get("bookingId"));
        String paymentMethod = body.get("paymentMethod");

        paymentService.processPayment(bookingId, paymentMethod);

        return ResponseEntity.ok("Payment processed successfully");
    }
}
