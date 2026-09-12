package com.velon.controller.booking;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.model.dto.RescheduleRequest;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Car;
import com.velon.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingRescheduleController extends BaseController {

    private final BookingDAO bookingDAO;
    private final BookingService bookingService;
    private final CarDAO carDAO;

    public BookingRescheduleController(
            BookingDAO bookingDAO,
            BookingService bookingService,
            CarDAO carDAO
    ) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
        this.carDAO = carDAO;
    }

    @PutMapping("/{id}/reschedule")
    public Object reschedule(
            @PathVariable Integer id,
            @RequestBody RescheduleRequest req
    ) {
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot reschedule cancelled booking");
        }

        bookingService.validateBooking(req.getStartDate());
        bookingService.validateDate(req.getStartDate(), req.getEndDate());

        // Check availability excluding current booking
        List<Booking> overlapping = bookingDAO.findBlockingBookingsForCar(
                booking.getCarId(),
                req.getStartDate(),
                req.getEndDate()
        );
        boolean hasConflict = overlapping.stream().anyMatch(b -> !b.getId().equals(booking.getId()));
        if (hasConflict) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Mobil tidak tersedia pada rentang tanggal yang dipilih");
        }

        Car car = carDAO.findById(booking.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        int newPrice = bookingService.calculateTotalPrice(
                req.getStartDate(),
                req.getEndDate(),
                car.getHargaPerHari()
        );

        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());
        booking.setTotalPrice(newPrice);

        return ok(bookingDAO.save(booking));
    }
}
