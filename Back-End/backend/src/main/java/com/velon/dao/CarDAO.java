package com.velon.dao;

import com.velon.model.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CarDAO extends JpaRepository<Car, Integer> {
    // DAO ini mewarisi operasi CRUD dasar dari JpaRepository
    
}
