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
@RequestMapping("/bookings")
public class BookingRescheduleController extends BaseController
        implements BookingOperation {

    private final BookingDAO bookingDAO;
    private final BookingService bookingService;

    public BookingRescheduleController(BookingDAO bookingDAO, BookingService bookingService) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
    }

    @Override
    @PutMapping("/reschedule/{id}")
    public Booking reschedule(
            @PathVariable Integer id,
            @RequestBody Object request
    ) {

        Booking req = (Booking) request;

        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        bookingService.validateHMinus3(booking.getStartDate());
        bookingService.validateDate(req.getStartDate(), req.getEndDate());

        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());

        return bookingDAO.save(booking);
    }

    // unused
    @Override
    public Object create(Object req) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Object cancel(Integer id) {
        throw new UnsupportedOperationException();
    }
}
