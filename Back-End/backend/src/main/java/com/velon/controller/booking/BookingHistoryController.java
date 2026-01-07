package com.velon.controller.booking;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingHistoryController extends BaseController {

    private final BookingDAO bookingDAO;

    public BookingHistoryController(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @GetMapping("/history/{userId}")
    public Object history(@PathVariable Integer userId) {
        System.out.println(" BOOKING HISTORY HIT USER ID = " + userId);
        List<Booking> bookings =
                bookingDAO.findByUserIdOrderByStartDateDesc(userId);
        return ok(bookings);
    }
}
