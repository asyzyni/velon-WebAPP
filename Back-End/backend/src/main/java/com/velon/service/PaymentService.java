package com.velon.service;

import com.velon.dao.BookingDAO;
import com.velon.dao.TransactionDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Transaction;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final BookingDAO bookingDAO;
    private final TransactionDAO transactionDAO;

    public PaymentService(BookingDAO bookingDAO, TransactionDAO transactionDAO) {
        this.bookingDAO = bookingDAO;
        this.transactionDAO = transactionDAO;
    }

    public Transaction submitPayment(
            Integer bookingId,
            String paymentMethod,
            String paymentProof
    ) {
        Booking booking = bookingDAO.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.WAITING_PAYMENT) {
            throw new RuntimeException("Booking not waiting payment");
        }

        Transaction transaction = transactionDAO.findByBookingId(bookingId);
        if (transaction == null) {
            transaction = new Transaction();
            transaction.setBookingId(bookingId);
        }

        transaction.setPaymentMethod(paymentMethod);
        transaction.setPaymentProof(paymentProof);
        transaction.setVerified(false);

        // ✅ JPA SAVE (BUKAN UPDATE)
        return transactionDAO.save(transaction);
    }

    public void verifyPayment(Integer bookingId) {
        Transaction transaction = transactionDAO.findByBookingId(bookingId);
        if (transaction == null) {
            throw new RuntimeException("Transaction not found");
        }

        transaction.setVerified(true);
        

        // ✅ JPA SAVE (BUKAN UPDATE)
        transactionDAO.save(transaction);

        Booking booking = bookingDAO.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingDAO.save(booking);
    }
}
