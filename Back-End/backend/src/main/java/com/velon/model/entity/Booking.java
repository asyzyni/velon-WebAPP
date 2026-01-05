package com.velon.model.entity;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // car_id (INT, NOT NULL)
    @Column(name = "car_id", nullable = false)
    private Integer carId;

    // start_date (DATE)
    @Column(name = "start_date")
    private LocalDate startDate;

    // end_date (DATE)
    @Column(name = "end_date")
    private LocalDate endDate;

    // status (VARCHAR)
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;

    // total_price (INT, NOT NULL)
    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;

    // payment_token (VARCHAR)
    @Column(name = "payment_token")
    private String paymentToken;

    // user_id (INT, NOT NULL)
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    // =====================
    // GETTER & SETTER
    // =====================

    public Integer getId() {
        return id;
    }

    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Integer getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Integer totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPaymentToken() {
        return paymentToken;
    }

    public void setPaymentToken(String paymentToken) {
        this.paymentToken = paymentToken;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
