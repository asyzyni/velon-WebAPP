package com.velon.controller.booking;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingInitController extends BaseController
        implements BookingOperation {

    private final BookingDAO bookingDAO;
    private final BookingService bookingService;
    private final ObjectMapper objectMapper;

    public BookingInitController(
            BookingDAO bookingDAO,
            BookingService bookingService,
            ObjectMapper objectMapper
    ) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
        this.objectMapper = objectMapper;

        //  INI KUNCI UTAMA (JANGAN DIHAPUS)
        this.objectMapper.configure(
                DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                false
        );
    }

    @Override
    @PostMapping("/init")
    public Booking create(@RequestBody Object request) {

        System.out.println(" BOOKING INIT CONTROLLER HIT 🔥");

        // ⬇️ BIAR FIELD ASING (pickupLocation dll) TIDAK ERROR
        Booking booking = objectMapper.convertValue(request, Booking.class);

        // =====================
        // VALIDATION MINIMAL
        // =====================
        if (booking.getUserId() == null) {
            throw new RuntimeException("userId is required");
        }
        if (booking.getCarId() == null) {
            throw new RuntimeException("carId is required");
        }
        if (booking.getStartDate() == null || booking.getEndDate() == null) {
            throw new RuntimeException("startDate & endDate are required");
        }

        // =====================
        // BUSINESS LOGIC MINIMAL
        // =====================
        booking.setStatus(BookingStatus.WAITING_PAYMENT);
        booking.setPaymentToken(bookingService.generatePaymentToken());
        booking.setTotalPrice(123456); // HARD-CODE DULU, YANG PENTING MASUK

        return bookingDAO.save(booking);
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
