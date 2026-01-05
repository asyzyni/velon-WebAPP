package com.velon.controller.Car;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.model.entity.Car;
import com.velon.service.CarAvailability;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cars")
public class CarSearchController extends BaseController {
    private final CarDAO carDAO;
    private final BookingDAO bookingDAO;
    private final CarAvailability carAvailability;

    public CarSearchController(
        CarDAO carDAO,
        BookingDAO bookingDAO,
        CarAvailability carAvailability
    ) {
        this.carDAO = carDAO;
        this.bookingDAO = bookingDAO;
        this.carAvailability = carAvailability;
    }

    @GetMapping
    public Object getAllCars() {
        List<Car> allCars = carDAO.findAll();
        return ok(allCars);
    }

    @PostMapping
    public Object createCar(@RequestBody Car car) {
        Car savedCar = carDAO.save(car);
        return ok(savedCar);
    }

    @GetMapping("/search")
    public Object search(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<Car> allCars = carDAO.findAll();
        List<com.velon.model.entity.Booking> bookingsInRange = bookingDAO.findConfirmedBookingInRange(startDate, endDate);

        List<Car> available = allCars.stream()
            .filter(car -> carAvailability.isAvailable(car, bookingsInRange))
            .collect(Collectors.toList());
        return ok(available);
    }
}
