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

        // ✅ abstraction: parsing disembunyikan
        RescheduleRequest req =
                objectMapper.convertValue(request, RescheduleRequest.class);

        // 1️⃣ ambil booking lama
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 2️⃣ rule bisnis
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot reschedule cancelled booking");
        }

        bookingService.validateBooking(req.getStartDate());
        bookingService.validateDate(req.getStartDate(), req.getEndDate());

        // ✅ INI YANG TADI HILANG
        Car car = carDAO.findById(booking.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // 3️⃣ hitung ulang harga
        int newPrice = bookingService.calculateTotalPrice(
                req.getStartDate(),
                req.getEndDate(),
                car.getHargaPerHari()
        );

        // 4️⃣ update booking
        booking.setStartDate(req.getStartDate());
        booking.setEndDate(req.getEndDate());
        booking.setTotalPrice(newPrice);

        return bookingDAO.save(booking);
    }

    // unused (polymorphism)
    @Override
    public Object create(Object req) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Object cancel(Integer id) {
        throw new UnsupportedOperationException();
    }
}
