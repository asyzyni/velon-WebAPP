package com.velon.controller.booking;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.model.dto.RescheduleRequest;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Car;
import com.velon.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingRescheduleController extends BaseController
        implements BookingOperation {

    private final BookingDAO bookingDAO;
    private final BookingService bookingService;
    private final CarDAO carDAO;
    private final ObjectMapper objectMapper;

    public BookingRescheduleController(
            BookingDAO bookingDAO,
            BookingService bookingService,
            CarDAO carDAO,
            ObjectMapper objectMapper
    ) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
        this.carDAO = carDAO;
        this.objectMapper = objectMapper;
    }

    @Override
    @PutMapping("/reschedule/{id}")
    public Object reschedule(
            @PathVariable Integer id,
            @RequestBody Object request
    ) {
        System.out.println("🔥 RESCHEDULE HIT ID = " + id);

        // CAST DI DALAM METHOD (INI YANG BENAR)
        RescheduleRequest req = objectMapper.convertValue(request, RescheduleRequest.class);

        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot reschedule cancelled booking");
        }

        bookingService.validateBooking(req.getStartDate());
        bookingService.validateDate(req.getStartDate(), req.getEndDate());

        List<Booking> conflicts = bookingDAO.findConfirmedBookingInRange(
                req.getStartDate(),
                req.getEndDate()
        );

        boolean hasConflict = conflicts.stream()
                .anyMatch(b ->
                        b.getCarId().equals(booking.getCarId()) &&
                        !b.getId().equals(booking.getId())
                );

        if (hasConflict) {
            throw new RuntimeException("Car not available");
        }

        Car car = carDAO.findById(booking.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());

        int newPrice = bookingService.calculateTotalPrice(
                req.getStartDate(),
                req.getEndDate(),
                car.getHargaPerHari()
        );

        booking.setTotalPrice(newPrice);

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
