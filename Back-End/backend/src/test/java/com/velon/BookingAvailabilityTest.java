package com.velon;

import com.velon.dao.CarDAO;
import com.velon.dao.UserDAO;
import com.velon.model.entity.Car;
import com.velon.model.entity.User;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(classes = BackendApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BookingAvailabilityTest {

    @Value("${local.server.port}")
    private int port;

    @Autowired
    private CarDAO carDAO;

    @Autowired
    private UserDAO userDAO;

    private Integer testUserId;
    private Integer testCarId;
    private int carDailyRate = 450000;

    @BeforeEach
    public void setUp() {
        RestAssured.port = port;

        // Ensure a test user exists
        User user = new User();
        user.setName("Availability Tester");
        user.setEmail("avail_test_" + UUID.randomUUID().toString().substring(0, 8) + "@velon.com");
        user.setPassword("$2a$10$dummyhashedpasswordfortestingpurposes");
        user.setRole("USER");
        user = userDAO.save(user);
        testUserId = user.getId();

        // Ensure a unique test car exists
        Car car = new Car();
        car.setNamaMobil("Test Booking Car " + UUID.randomUUID().toString().substring(0, 5));
        car.setJenisMobil("Sedan");
        car.setHargaPerHari(carDailyRate);
        car.setKapasitas(5);
        car.setStatus("AVAILABLE");
        car = carDAO.save(car);
        testCarId = car.getId();
    }

    @Test
    public void testBookingCreation_PreventsDoubleBooking_AndCalculatesAccuratePrice() {
        LocalDate start = LocalDate.now().plusDays(10);
        LocalDate end = start.plusDays(3); // 4 days inclusive

        Map<String, Object> booking1 = new HashMap<>();
        booking1.put("userId", testUserId);
        booking1.put("carId", testCarId);
        booking1.put("startDate", start.toString());
        booking1.put("endDate", end.toString());
        booking1.put("pickupLocation", "Jakarta Airport");

        // 1. First booking must succeed and have accurate price: 4 days * 450,000 = 1,800,000
        int expectedPrice = 4 * carDailyRate;

        given()
                .contentType(ContentType.JSON)
                .body(booking1)
                .when()
                .post("/bookings/init")
                .then()
                .statusCode(200)
                .body("carId", equalTo(testCarId))
                .body("totalPrice", equalTo(expectedPrice))
                .body("status", equalTo("WAITING_PAYMENT"));

        // 2. Second booking with overlapping dates for SAME car must be rejected with 409 Conflict
        Map<String, Object> overlappingBooking = new HashMap<>();
        overlappingBooking.put("userId", testUserId);
        overlappingBooking.put("carId", testCarId);
        // Overlaps start + 1 to start + 5
        overlappingBooking.put("startDate", start.plusDays(1).toString());
        overlappingBooking.put("endDate", start.plusDays(5).toString());
        overlappingBooking.put("pickupLocation", "Bandung");

        given()
                .contentType(ContentType.JSON)
                .body(overlappingBooking)
                .when()
                .post("/bookings/init")
                .then()
                .statusCode(409)
                .body(containsString("Mobil tidak tersedia pada rentang tanggal yang dipilih"));

        // 3. Booking for SAME car but NON-OVERLAPPING dates (after the first booking) must succeed
        Map<String, Object> nonOverlappingBooking = new HashMap<>();
        nonOverlappingBooking.put("userId", testUserId);
        nonOverlappingBooking.put("carId", testCarId);
        nonOverlappingBooking.put("startDate", end.plusDays(2).toString());
        nonOverlappingBooking.put("endDate", end.plusDays(4).toString()); // 3 days inclusive: 3 * 450,000 = 1,350,000
        nonOverlappingBooking.put("pickupLocation", "Surabaya");

        given()
                .contentType(ContentType.JSON)
                .body(nonOverlappingBooking)
                .when()
                .post("/bookings/init")
                .then()
                .statusCode(200)
                .body("carId", equalTo(testCarId))
                .body("totalPrice", equalTo(3 * carDailyRate));
    }
}
