package com.velon.controller.booking;

import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserBookingController {
    private final BookingDAO bookingDAO;

    public UserBookingController(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @GetMapping("/{userId}/bookings")
    public List<Booking> getUserBookings(@PathVariable Integer userId) {
        return bookingDAO.findByUserId(userId);
    }

}
