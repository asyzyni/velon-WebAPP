package com.velon.service;

import java.time.LocalDate;
import java.util.List;

import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.Car;
import org.springframework.stereotype.Service;

@Service
public class CarAvailability {

    private final BookingDAO bookingDAO;

    public CarAvailability(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    public boolean isAvailable(Car car, List<Booking> bookings) {
        for (Booking booking : bookings) {
            if (booking.getCarId().equals(car.getId())) {
                return false;
            }
        }
        return true;
    }

    public boolean isCarAvailable(Integer carId, LocalDate startDate, LocalDate endDate) {
        List<Booking> blocking = bookingDAO.findBlockingBookingsForCar(carId, startDate, endDate);
        return blocking.isEmpty();
    }
}
