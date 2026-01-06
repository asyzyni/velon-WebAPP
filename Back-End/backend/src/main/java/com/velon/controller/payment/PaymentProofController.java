package com.velon.controller.payment;

import com.velon.dao.TransactionDAO;
import com.velon.model.entity.Transaction;

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
public class PaymentProofController {

    private final TransactionDAO transactionDAO;

    public PaymentProofController(TransactionDAO transactionDAO) {
        this.transactionDAO = transactionDAO;
    }

    @PostMapping("/{bookingId}/upload-proof")
    public ResponseEntity<?> uploadProof(
            @PathVariable Integer bookingId,
            @RequestParam("file") MultipartFile file) {
        try {
            // 1. simpan file
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/" + filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            // 2. update transaction
            Transaction trx = transactionDAO.findByBookingId(bookingId);
            if (trx == null) {
                return ResponseEntity.badRequest().body("Transaction not found");
            }

            trx.setPaymentProof(filename);
            trx.setVerified(false);
            transactionDAO.save(trx);

            return ResponseEntity.ok("UPLOAD OK");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Upload failed");
        }
    }
}
