package com.velon.controller.booking;
import com.velon.service.BookingService;
import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings/init")
public class BookingInitController extends BaseController {
    private final BookingDAO bookingDAO;
    private final BookingService bookingService;

    public BookingInitController(BookingDAO bookingDAO, BookingService bookingService) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        // Validasi logic
        bookingService.validateDate(booking.getStartDate(), booking.getEndDate());

        // set status awal
        bookingService.setInitialStatus(booking);

        // generate token pembayaran
        booking.setPaymentToken(bookingService.generatePaymentToken());

        return bookingDAO.save(booking);
    }
}
