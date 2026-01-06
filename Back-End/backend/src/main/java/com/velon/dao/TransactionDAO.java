package com.velon.dao;

import com.velon.model.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionDAO extends JpaRepository<Transaction, Integer> {

    Transaction findByBookingId(Integer bookingId);
}
