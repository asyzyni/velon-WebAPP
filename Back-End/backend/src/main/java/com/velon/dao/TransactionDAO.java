package com.velon.dao;

import com.velon.model.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionDAO extends JpaRepository<Transaction, Integer> {

}
