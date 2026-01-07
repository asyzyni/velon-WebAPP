package com.velon.service;

import com.velon.dao.BookingDAO;
import com.velon.dao.TransactionDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Transaction;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class PaymentService {

    private final BookingDAO bookingDAO;
    private final TransactionDAO transactionDAO;

    public PaymentService(
            BookingDAO bookingDAO,
            TransactionDAO transactionDAO
    ) {
        this.bookingDAO = bookingDAO;
        this.transactionDAO = transactionDAO;
    }

    /**
     * USER UPLOAD PAYMENT PROOF
     */
    public Transaction uploadPaymentProof(
            Integer bookingId,
            MultipartFile file
    ) {
        Booking booking = bookingDAO.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.WAITING_PAYMENT) {
            throw new RuntimeException("Booking not waiting payment");
        }

        // simulate save file (no filesystem dulu, aman buat demo)
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Transaction transaction = transactionDAO.findByBookingId(bookingId);
        if (transaction == null) {
            transaction = new Transaction();
            transaction.setBookingId(bookingId);
        }

        transaction.setPaymentMethod("TRANSFER");
        transaction.setPaymentProof(filename);
        transaction.setVerified(false);

        transactionDAO.save(transaction);

        // 🔴 PENTING: UPDATE BOOKING STATUS
        booking.setStatus(BookingStatus.WAITING_CONFIRMATION);
        bookingDAO.save(booking);

        return transaction;
    }

    /**
     * ADMIN CONFIRM PAYMENT
     */
    public void verifyPayment(Integer bookingId) {
        Transaction transaction = transactionDAO.findByBookingId(bookingId);
        if (transaction == null) {
            throw new RuntimeException("Transaction not found");
        }

        transaction.setVerified(true);
        transactionDAO.save(transaction);

        Booking booking = bookingDAO.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingDAO.save(booking);
    }
}
