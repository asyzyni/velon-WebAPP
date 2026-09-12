package com.velon.controller.payment;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/payments")
public class PaymentProofController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(PaymentProofController.class);

    private final BookingDAO bookingDAO;

    public PaymentProofController(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @PostMapping("/{bookingId}/upload-proof")
    public Object uploadProof(
            @PathVariable Integer bookingId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return bad("File must not be empty");
            }

            String contentType = file.getContentType();
            String extension;
            if ("image/jpeg".equalsIgnoreCase(contentType) || "image/jpg".equalsIgnoreCase(contentType)) {
                extension = ".jpg";
            } else if ("image/png".equalsIgnoreCase(contentType)) {
                extension = ".png";
            } else {
                return bad("Invalid file type. Only JPEG and PNG images are allowed.");
            }

            // 1. Find booking
            Booking booking = bookingDAO.findById(bookingId).orElse(null);
            if (booking == null) {
                return bad("Booking not found");
            }

            // 2. Save file with sanitized UUID-based filename
            String filename = UUID.randomUUID().toString() + extension;
            Path path = Paths.get("uploads", filename);
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
            }
            Files.write(path, file.getBytes());

            // 3. Update booking status
            booking.setStatus(BookingStatus.WAITING_CONFIRMATION);
            bookingDAO.save(booking);

            log.info("Payment proof uploaded successfully for bookingId: {}", bookingId);
            return ok("Upload successful. Waiting for admin confirmation.");

        } catch (IOException e) {
            log.error("Failed to save payment proof file for bookingId: {}", bookingId, e);
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Upload error for bookingId: {}", bookingId, e);
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}
