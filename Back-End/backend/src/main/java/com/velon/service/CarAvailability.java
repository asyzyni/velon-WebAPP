package com.velon.service;

import java.util.List;

import com.velon.model.entity.Booking;
import com.velon.model.entity.Car;
import org.springframework.stereotype.Service;

@Service
public class CarAvailability {
    public boolean isAvailable(Car car, List<Booking> bookings) {
        for (Booking booking : bookings) {
            if (booking.getCarId().equals(car.getId())) {
                return false;
            }
        }
        return true;
    }

}
