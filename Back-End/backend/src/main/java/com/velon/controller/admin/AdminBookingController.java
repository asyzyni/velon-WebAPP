package com.velon.controller.admin;

import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.dao.TransactionDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Car;
import com.velon.model.entity.Transaction;
import com.velon.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/admin/bookings")
public class AdminBookingController {
    private final BookingDAO bookingDAO;
    private final CarDAO carDAO;
    private final BookingService bookingService;
    private final ObjectMapper objectMapper;
    private final TransactionDAO transactionDAO;

    public AdminBookingController(BookingDAO bookingDAO, CarDAO carDAO, BookingService bookingService,
            ObjectMapper objectMapper, TransactionDAO transactionDAO) {
        this.bookingDAO = bookingDAO;
        this.carDAO = carDAO;
        this.bookingService = bookingService;
        this.objectMapper = objectMapper;
        this.transactionDAO = transactionDAO;
    }

    // get all bookings
    @GetMapping()
    public List<Booking> getAllBookings() {
        return bookingDAO.findAll();
    }

    // create new booking (admin)
    @PostMapping()
    public Booking createBooking(@RequestBody Object request) {
        // Convert Object to Booking using ObjectMapper
        Booking booking = objectMapper.convertValue(request, Booking.class);

        // Validate required fields
        if (booking.getUserId() == null) {
            throw new RuntimeException("userId is required");
        }
        if (booking.getCarId() == null) {
            throw new RuntimeException("carId is required");
        }

        // Get car to calculate total price
        Car car = carDAO.findById(booking.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        bookingService.validateDate(
                booking.getStartDate(),
                booking.getEndDate());
        bookingService.validateBooking(booking.getStartDate());

        // Calculate total price
        int totalPrice = bookingService.calculateTotalPrice(
                booking.getStartDate(),
                booking.getEndDate(),
                car.getHargaPerHari());
        booking.setTotalPrice(totalPrice);

        booking.setStatus(BookingStatus.WAITING_PAYMENT);
        booking.setPaymentToken(bookingService.generatePaymentToken());

        return bookingDAO.save(booking);
    }

    // update booking status
    @PutMapping("/{id}/status")
    public Booking updateBookingStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingStatus newStatus = BookingStatus.valueOf(body.get("status"));
        booking.setStatus(newStatus);
        return bookingDAO.save(booking);
    }

    @PutMapping("/{id}/verify-payment")
    public Booking verifyPayment(@PathVariable Integer id) {
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingDAO.save(booking);

        Transaction transaction = transactionDAO.findByBookingId(id);

        transaction.setStatus("PAID");
        transaction.setVerified(true);
        transactionDAO.save(transaction);

        return booking;
    }

    // approve booking
    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Integer id) {
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingDAO.save(booking);
    }

    // cancel booking
    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Integer id) {
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingDAO.save(booking);
    }

    // mark booking as completed
    @PutMapping("/{id}/complete")
    public Booking completeBooking(@PathVariable Integer id) {
        Booking booking = bookingDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.COMPLETED);
        return bookingDAO.save(booking);
    }

}
