package com.velon.controller.booking;

import com.velon.model.entity.Booking;
import com.velon.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings/history")
public class BookingHistoryController {
    private final BookingService bookingService;

    public BookingHistoryController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Booking>> getBookingHistory(@PathVariable Integer userId) {
        try {
            List<Booking> bookings = bookingService.getBookingHistoryByUserId(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching booking history: " + e.getMessage(), e);
        }
    }
}
