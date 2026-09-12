package com.velon;

import com.velon.dao.BookingDAO;
import com.velon.dao.CarDAO;
import com.velon.dao.UserDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import com.velon.model.entity.Car;
import com.velon.model.entity.User;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;

@SpringBootTest(classes = BackendApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PaymentProofTest {

    @Value("${local.server.port}")
    private int port;

    @Autowired
    private BookingDAO bookingDAO;

    @Autowired
    private CarDAO carDAO;

    @Autowired
    private UserDAO userDAO;

    private Integer testBookingId;

    @BeforeEach
    public void setUp() {
        RestAssured.port = port;

        User user = new User();
        user.setName("Proof Tester");
        user.setEmail("proof_test_" + UUID.randomUUID().toString().substring(0, 8) + "@velon.com");
        user.setPassword("$2a$10$dummyhashedpasswordfortestingpurposes");
        user.setRole("USER");
        user = userDAO.save(user);

        Car car = new Car();
        car.setNamaMobil("Proof Car " + UUID.randomUUID().toString().substring(0, 5));
        car.setHargaPerHari(300000);
        car.setKapasitas(4);
        car.setStatus("AVAILABLE");
        car = carDAO.save(car);

        Booking booking = new Booking();
        booking.setUserId(user.getId());
        booking.setCarId(car.getId());
        booking.setStartDate(LocalDate.now().plusDays(10));
        booking.setEndDate(LocalDate.now().plusDays(12));
        booking.setStatus(BookingStatus.WAITING_PAYMENT);
        booking.setTotalPrice(900000);
        booking.setPaymentToken("PAY-TEST-PROOF");
        booking = bookingDAO.save(booking);
        testBookingId = booking.getId();
    }

    @Test
    public void testUploadProof_RejectsNonImageFiles() {
        byte[] fakeTextContent = "Hello this is a malicious script or text file".getBytes();

        given()
                .multiPart("file", "malicious.sh", fakeTextContent, "text/plain")
                .when()
                .post("/payments/" + testBookingId + "/upload-proof")
                .then()
                .statusCode(400)
                .body(containsString("Only JPEG and PNG images are allowed"));
    }

    @Test
    public void testUploadProof_AcceptsValidImage() {
        // 1x1 transparent PNG bytes
        byte[] pngBytes = new byte[] {
                (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
                0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
                0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
                0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, (byte) 0xC4,
                (byte) 0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
                0x54, 0x78, (byte) 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
                0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, (byte) 0xB4, 0x00,
                0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, (byte) 0xAE,
                0x42, 0x60, (byte) 0x82
        };

        given()
                .multiPart("file", "receipt.png", pngBytes, "image/png")
                .when()
                .post("/payments/" + testBookingId + "/upload-proof")
                .then()
                .statusCode(200)
                .body(containsString("Upload successful"));
    }
}
