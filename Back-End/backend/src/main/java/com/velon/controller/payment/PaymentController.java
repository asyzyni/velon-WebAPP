package com.velon.controller.payment;

import com.velon.controller.base.BaseController;
import com.velon.model.dto.PaymentRequest;
import com.velon.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController extends BaseController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/submit")
    public Object submit(@RequestBody PaymentRequest req) {

        return ok(
            paymentService.submitPayment(
                req.getBookingId(),
                req.getPaymentMethod(),
                req.getPaymentProof()
            )
        );
    }
}
