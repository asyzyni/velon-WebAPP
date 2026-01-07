package com.velon.controller.payment;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController extends BaseController {

    private final BookingDAO bookingDAO;

    public PaymentController(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @PostMapping("/confirm/{bookingId}")
    public Object confirm(@PathVariable Integer bookingId) {

        Booking booking = bookingDAO.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.WAITING_PAYMENT) {
            throw new RuntimeException("Booking not waiting payment");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingDAO.save(booking);

        return ok("PAYMENT CONFIRMED (DUMMY)");
    }
}
