package com.velon.controller.booking;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.service.BookingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingCancelController extends BaseController
        implements BookingOperation {

    private final BookingDAO bookingDAO;
    private final BookingService bookingService;

    public BookingCancelController(
            BookingDAO bookingDAO,
            BookingService bookingService
    ) {
        this.bookingDAO = bookingDAO;
        this.bookingService = bookingService;
    }

    @Override
    @PutMapping("/cancel/{id}")
    public Object cancel(@PathVariable Integer id) {

        System.out.println(" CANCEL HIT ID = " + id);

        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Validasi H-3 rule (tidak boleh cancel mendadak)
        bookingService.validateBooking(booking.getStartDate());

        // Ubah status
        booking.setStatus(BookingStatus.CANCELLED);

        // SAVE via JPA (WAJIB)
        return bookingDAO.save(booking);
    }

    // unused
    @Override
    public Object create(Object req) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Object reschedule(Integer id, Object req) {
        throw new UnsupportedOperationException();
    }
}
