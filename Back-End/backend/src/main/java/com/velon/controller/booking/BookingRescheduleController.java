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

@RestController
@RequestMapping("/bookings")
public class BookingRescheduleController extends BaseController {

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

    @PutMapping("/{id}/reschedule")
    public Object reschedule(
            @PathVariable Integer id,
            @RequestBody RescheduleRequest req
    ) {

        System.out.println("🔥 RESCHEDULE HIT ID = " + id);

        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot reschedule cancelled booking");
        }

        bookingService.validateBooking(req.getStartDate());
        bookingService.validateDate(req.getStartDate(), req.getEndDate());

        Car car = carDAO.findById(booking.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        int newPrice = bookingService.calculateTotalPrice(
                booking.getCarId(),
                req.getStartDate(),
                req.getEndDate()
        );

        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());
        booking.setTotalPrice(newPrice);

        return ok(bookingDAO.save(booking));
    }
}
