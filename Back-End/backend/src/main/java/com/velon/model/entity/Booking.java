package com.velon.model.entity;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="car_id")
    private Integer carId;

    @Column(name="start_date")
    private LocalDate startDate;

    @Column(name="end_date")
    private LocalDate endDate;

    private String status; // Confirmed  or cancelled

    // Getters and Setters
    public Integer getId() {
        return id; 
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status; 
    }

}
