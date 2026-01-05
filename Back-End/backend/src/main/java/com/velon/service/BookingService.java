package com.velon.service;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Booking;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.stereotype.Service;


@Service
public class BookingService {
    // Validasi H-3 Booking

    public void validateBooking(LocalDate startDate) {
        long daysDiff = ChronoUnit.DAYS.between(LocalDate.now(), startDate);

        if (daysDiff < 3) {
            throw new RuntimeException("Bookings must be made at least 3 days in advance.");
        }
    }

    // Validasi rentang tanggal 
    public void validateDate(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
            throw new RuntimeException("Invalid date range");
        }
    }

    // Hitung Total Harga Booking

    public int calculateTotalPrice(LocalDate startDate, LocalDate endDate, int pricePerDay) {
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1; // Termasuk hari terakhir

        if (totalDays <= 0) {
            throw new IllegalArgumentException("Tanggal Booking tidak valid");
        }

        return (int) (totalDays * pricePerDay);
    }

    // Generate Token Pembayaran Unik

    public String generatePaymentToken(){
        return "PAY-" + UUID.randomUUID();
    }

    // Set Status Booking Menjadi WAITING_PAYMENT

    public void setInitialStatus(Booking booking) {
        booking.setStatus(BookingStatus.WAITING_PAYMENT);
    }

    // Proses Cancel Booking

    public void cancelBooking(Booking booking) {
        validateBooking(booking.getStartDate());
        booking.setStatus(BookingStatus.CANCELLED);
    }

    // Proses Reschedule Booking

    public void rescheduleBooking(Booking booking, LocalDate newStart, LocalDate newEnd) {
        validateBooking(booking.getStartDate());
        validateDate(newStart, newEnd);

        if (booking.getStatus() != BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking yang dibatalkan tidak bisa di reschedule");
        }

        booking.setStartDate(newStart);
        booking.setEndDate(newEnd);
    }
}
