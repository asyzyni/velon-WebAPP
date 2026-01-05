package com.velon.service;

import com.velon.dao.BookingDAO;
import com.velon.dao.TransactionDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.Transaction;
import com.velon.model.entity.BookingStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final BookingDAO bookingDAO;
    private final TransactionDAO transactionDAO;

    public PaymentService(BookingDAO bookingDAO, TransactionDAO transactionDAO) {
        this.bookingDAO = bookingDAO;
        this.transactionDAO = transactionDAO;
    }

    public void processPayment(Integer bookingId, String paymentMethod) {

        Booking booking = bookingDAO.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.WAITING_PAYMENT) {
            throw new RuntimeException("Booking not waiting payment");
        }

        // update booking
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingDAO.save(booking);

        // save transaction
        Transaction transaction = new Transaction();
        transaction.setBookingId(bookingId);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setStatus("PAID");
        transaction.setCreatedAt(LocalDateTime.now());
        transactionDAO.save(transaction);
    }
}
