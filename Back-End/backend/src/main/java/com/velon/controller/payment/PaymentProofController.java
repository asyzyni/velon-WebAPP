package com.velon.controller.payment;

import com.velon.controller.base.BaseController;
import com.velon.dao.BookingDAO;
import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/payments")
public class PaymentProofController extends BaseController {

    private final BookingDAO bookingDAO;

    public PaymentProofController(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @PostMapping("/{bookingId}/upload-proof")
    public Object uploadProof(
            @PathVariable Integer bookingId,
            @RequestParam("file") MultipartFile file) {
        try {
            System.out.println("📤 UPLOAD PROOF - Booking ID: " + bookingId);

            // 1. Find booking
            Booking booking = bookingDAO.findById(bookingId).orElse(null);
            if (booking == null) {
                System.out.println("❌ Booking not found: " + bookingId);
                return ResponseEntity.badRequest().body("Booking not found");
            }

            // 2. Save file
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/" + filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            System.out.println("✅ File saved: " + filename);

            // 3. Update booking status
            booking.setStatus(BookingStatus.WAITING_CONFIRMATION);
            bookingDAO.save(booking);

            System.out.println("✅ Booking status updated to WAITING_CONFIRMATION");

            return ok("Upload successful. Waiting for admin confirmation.");

        } catch (Exception e) {
            System.out.println("❌ Upload failed");
            e.printStackTrace();
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}
