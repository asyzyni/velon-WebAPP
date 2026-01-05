package com.velon.controller.booking;

import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.model.dto.RescheduleRequest;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Car;
import com.velon.service.BookingService;
import com.velon.controller.base.BaseController;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingRescheduleController extends BaseController
        implements BookingOperation {

    private final BookingDAO bookingDAO;
    private final BookingService bookingService;
    private final CarDAO carDAO;

    public BookingRescheduleController(BookingDAO bookingDAO, BookingService bookingService, CarDAO carDAO) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
        this.carDAO = carDAO;
    }

    @Override
    @PutMapping("/reschedule/{id}")
    public Booking reschedule(
            @PathVariable Integer id,
            @RequestBody Object request
    ) {
        RescheduleRequest req = (RescheduleRequest) request;

        // Find the existing booking
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if booking is already cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot reschedule a cancelled booking");
        }

        // Validate new dates (H-3 rule and date range)
        bookingService.validateBooking(req.getStartDate());
        bookingService.validateDate(req.getStartDate(), req.getEndDate());

        // Check if the car is available for the new date range
        List<Booking> conflictingBookings = bookingDAO.findConfirmedBookingInRange(
                req.getStartDate(),
                req.getEndDate()
        );

        // Filter out the current booking from conflicts
        boolean hasConflict = conflictingBookings.stream()
                .anyMatch(b -> b.getCarId().equals(booking.getCarId()) && !b.getId().equals(booking.getId()));

        if (hasConflict) {
            throw new RuntimeException("Car is not available for the selected dates");
        }

        // Get car details to recalculate price
        Car car = carDAO.findById(booking.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Update booking dates
        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());

        // Recalculate total price based on new dates
        int newTotalPrice = bookingService.calculateTotalPrice(
                req.getStartDate(),
                req.getEndDate(),
                car.getHargaPerHari()
        );
        booking.setTotalPrice(newTotalPrice);

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

    // log debug 

}
