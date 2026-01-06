package com.velon.dao;

import com.velon.model.entity.Booking;
import com.velon.model.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingDAO extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserId(Integer userId);

    @Query(
        "SELECT b FROM Booking b " +
        "WHERE b.status = com.velon.model.entity.BookingStatus.CONFIRMED " +
        "AND (b.startDate <= :endDate AND b.endDate >= :startDate)"
    )
    List<Booking> findConfirmedBookingInRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(
        "SELECT b FROM Booking b " +
        "WHERE b.userId = :userId " +
        "ORDER BY b.startDate DESC"
    )
    List<Booking> findByUserIdOrderByStartDateDesc(
            @Param("userId") Integer userId
    );

    // =========================
    // UPDATE STATUS
    // =========================
    @Modifying
    @Transactional
    @Query("UPDATE Booking b SET b.status = :status WHERE b.id = :id")
    void updateStatus(
            @Param("id") Integer id,
            @Param("status") BookingStatus status
    );
}
