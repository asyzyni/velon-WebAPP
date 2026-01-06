package com.velon.dao;

import com.velon.model.entity.Transaction;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

@Repository
public class TransactionDAO {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/velon_db";
    private static final String DB_USER = "asyzyni";
    private static final String DB_PASSWORD = "Tan45is1!";

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    // =====================
    // INSERT TRANSACTION
    // =====================
    public void insert(Transaction t) {
        String sql =
            "INSERT INTO \"transaction\" (booking_id, payment_method, status, created_at) " +
            "VALUES (?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, t.getBookingId());
            stmt.setString(2, t.getPaymentMethod());
            stmt.setString(3, t.getStatus());
            stmt.setTimestamp(4, Timestamp.valueOf(t.getCreatedAt()));

            stmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Insert transaction failed");
        }
    }

    // =====================
    // FIND BY BOOKING ID
    // =====================
    public Transaction findByBookingId(Integer bookingId) {
        String sql =
            "SELECT * FROM \"transaction\" WHERE booking_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, bookingId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Transaction t = new Transaction();
                t.setId(rs.getInt("id"));
                t.setBookingId(rs.getInt("booking_id"));
                t.setPaymentMethod(rs.getString("payment_method"));
                t.setStatus(rs.getString("status"));
                t.setPaymentProof(rs.getString("payment_proof"));
                t.setVerified(rs.getBoolean("verified"));
                t.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                return t;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    // =====================
    // UPDATE PAYMENT PROOF
    // =====================
    public void update(Transaction t) {
        String sql =
            "UPDATE \"transaction\" " +
            "SET payment_proof = ?, verified = ? " +
            "WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, t.getPaymentProof());
            stmt.setBoolean(2, t.getVerified());
            stmt.setInt(3, t.getId());

            stmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Update transaction failed");
        }
    }
}
