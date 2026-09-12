package com.velon;

import com.velon.dao.BookingDAO;
import com.velon.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class BookingPricingTest {

    private BookingService bookingService;
    private BookingDAO bookingDAO;

    @BeforeEach
    public void setUp() {
        bookingDAO = Mockito.mock(BookingDAO.class);
        bookingService = new BookingService(bookingDAO);
    }

    @Test
    public void testCalculateTotalPrice_SingleDay() {
        LocalDate date = LocalDate.now().plusDays(5);
        int pricePerDay = 350000;

        int total = bookingService.calculateTotalPrice(date, date, pricePerDay);
        assertEquals(350000, total, "Single day rental must equal 1 * pricePerDay");
    }

    @Test
    public void testCalculateTotalPrice_MultipleDays() {
        LocalDate start = LocalDate.now().plusDays(5);
        LocalDate end = start.plusDays(2); // 3 days inclusive: day 0, day 1, day 2
        int pricePerDay = 500000;

        int total = bookingService.calculateTotalPrice(start, end, pricePerDay);
        assertEquals(1500000, total, "3-day rental must equal 3 * pricePerDay (1,500,000)");
    }

    @Test
    public void testCalculateTotalPrice_InvalidDateRange() {
        LocalDate start = LocalDate.now().plusDays(5);
        LocalDate end = start.minusDays(1);

        assertThrows(RuntimeException.class, () -> {
            bookingService.calculateTotalPrice(start, end, 300000);
        });
    }

    @Test
    public void testValidateBooking_AdvanceNotice() {
        LocalDate tooSoon = LocalDate.now().plusDays(1);
        assertThrows(RuntimeException.class, () -> {
            bookingService.validateBooking(tooSoon);
        });

        LocalDate validDate = LocalDate.now().plusDays(3);
        assertDoesNotThrow(() -> {
            bookingService.validateBooking(validDate);
        });
    }
}
