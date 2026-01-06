package com.velon.controller.admin;

import com.velon.controller.base.BaseController;
import com.velon.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/payments")
public class AdminPaymentController extends BaseController {

    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PutMapping("/verify/{bookingId}")
    public Object verify(@PathVariable Integer bookingId) {

        paymentService.verifyPayment(bookingId);
        return ok("Payment verified");
    }
}
