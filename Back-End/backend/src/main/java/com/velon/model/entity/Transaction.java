package com.velon.model.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
public class Transaction {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "booking_id", nullable = false)
    private Integer bookingId;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "payment_proof")
    private String paymentProof;

    private Boolean verified;

    // ===== GETTER SETTER =====
    public Integer getId() { 
        return id; 
    }

    public void setId(Integer id) { 
        this.id = id; 
    }

    public Integer getBookingId() { 
        return bookingId; 
    }
    public void setBookingId(Integer bookingId) { 
        this.bookingId = bookingId; 
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { 
        this.paymentMethod = paymentMethod; 
    }

    public String getStatus() { 
        return status; 
    }
    public void setStatus(String status) { 
        this.status = status; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }

    public String getPaymentProof() { 
        return paymentProof; 
    }
    public void setPaymentProof(String paymentProof) { 
        this.paymentProof = paymentProof; 
    }

    public Boolean getVerified() { 
        return verified; 
    }    
    public void setVerified(Boolean verified) { 
        this.verified = verified; 
    }


}
