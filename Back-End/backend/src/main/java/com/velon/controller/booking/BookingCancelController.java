package com.velon.controller.booking;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import com.velon.service.BookingService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings/cancel")
public class BookingCancelController extends BaseController {
    private final BookingDAO bookingDAO;
    private final BookingService bookingService;

    public BookingCancelController(BookingDAO bookingDAO, BookingService bookingService) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService; 
    }

    @PutMapping("/{id}")
    public Booking cancelBooking(@PathVariable Integer id) {
        Booking booking = bookingDAO.findById(id).orElseThrow(() -> new RuntimeException("Booking tidak ditemukan"));

        // cancel (validasi H-3)
        bookingService.cancelBooking(booking);

        // simulasi refund
        System.out.println("Refund diproses untuk booking id: " + id);
        return bookingDAO.save(booking);
    }
}
