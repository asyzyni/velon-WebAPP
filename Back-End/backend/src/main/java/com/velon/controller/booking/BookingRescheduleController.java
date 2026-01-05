package com.velon.controller.booking;

import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.Car;
import com.velon.service.BookingService;
import com.velon.service.CarAvailability;
import com.velon.controller.base.BaseController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings/reschedule")
public class BookingRescheduleController extends BaseController {
    private final BookingDAO bookingDAO;
    private final BookingService bookingService;
    private final CarAvailability carAvailability;

    public BookingRescheduleController(BookingDAO bookingDAO, BookingService bookingService, CarAvailability carAvailability) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
        this.carAvailability = carAvailability;
        
    }

    @PutMapping("/{id}")
    public Booking rescheduleBooking(@PathVariable Integer id, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newStart,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newEnd) {
        Booking booking = bookingDAO.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));

        // reschedule (H-3)
        bookingService.rescheduleBooking(booking, newStart, newEnd);

        return bookingDAO.save(booking);
    }
}
