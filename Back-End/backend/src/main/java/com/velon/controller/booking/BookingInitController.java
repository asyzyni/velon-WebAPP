package com.velon.controller.booking;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Car;
import com.velon.service.BookingService;
import com.velon.service.CarAvailability;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingInitController extends BaseController
        implements BookingOperation {

    private final BookingDAO bookingDAO;
    private final CarDAO carDAO;
    private final BookingService bookingService;
    private final CarAvailability carAvailability;
    private final ObjectMapper objectMapper;

    public BookingInitController(
            BookingDAO bookingDAO,
            CarDAO carDAO,
            BookingService bookingService,
            CarAvailability carAvailability,
            ObjectMapper objectMapper) {
        this.bookingDAO = bookingDAO;
        this.carDAO = carDAO;
        this.bookingService = bookingService;
        this.carAvailability = carAvailability;
        this.objectMapper = objectMapper;

        // INI KUNCI UTAMA (JANGAN DIHAPUS)
        this.objectMapper.configure(
                DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                false);
    }

    @Override
    @PostMapping("/init")
    public Object create(@RequestBody Object request) {
        Booking booking;
        try {
            booking = objectMapper.convertValue(request, Booking.class);
        } catch (Exception e) {
            return bad("Invalid booking request format");
        }

        // =====================
        // VALIDATION
        // =====================
        if (booking.getUserId() == null) {
            return bad("userId is required");
        }
        if (booking.getCarId() == null) {
            return bad("carId is required");
        }
        if (booking.getStartDate() == null || booking.getEndDate() == null) {
            return bad("startDate & endDate are required");
        }

        try {
            bookingService.validateDate(booking.getStartDate(), booking.getEndDate());
        } catch (Exception e) {
            return bad(e.getMessage());
        }

        Car car = carDAO.findById(booking.getCarId()).orElse(null);
        if (car == null) {
            return bad("Car not found");
        }

        // =====================
        // AVAILABILITY CHECK
        // =====================
        if (!carAvailability.isCarAvailable(booking.getCarId(), booking.getStartDate(), booking.getEndDate())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Mobil tidak tersedia pada rentang tanggal yang dipilih");
        }

        // =====================
        // BUSINESS LOGIC & PRICING
        // =====================
        booking.setStatus(BookingStatus.WAITING_PAYMENT);
        booking.setPaymentToken(bookingService.generatePaymentToken());
        int totalPrice = bookingService.calculateTotalPrice(
                booking.getStartDate(),
                booking.getEndDate(),
                car.getHargaPerHari()
        );
        booking.setTotalPrice(totalPrice);

        Booking saved = bookingDAO.save(booking);
        return ok(saved);
    }

    @GetMapping("/{id}")
    public Object getBookingById(@PathVariable Integer id) {
        Booking booking = bookingDAO.findById(id).orElse(null);
        if (booking == null) {
            return bad("Booking not found with id: " + id);
        }
        return ok(booking);
    }

    @Override
    public Object reschedule(Integer id, Object req) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Object cancel(Integer id) {
        throw new UnsupportedOperationException();
    }
}
