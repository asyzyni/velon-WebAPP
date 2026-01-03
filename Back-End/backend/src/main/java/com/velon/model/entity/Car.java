package com.velon.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "car")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="nama_mobil")
    private String namaMobil;
    @Column(name="jenis_mobil")
    private String jenisMobil;
    @Column(name="harga_per_hari")
    private Integer hargaPerHari;
    @Column(name="kapasitas")
    private Integer kapasitas;

    private String status;

    // Getters and Setters
    public Integer getId() {
        return id; 
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNamaMobil() {
        return namaMobil;
    }

    public void setNamaMobil(String namaMobil) {
        this.namaMobil = namaMobil; 
    }

    public String getJenis() {
        return jenisMobil;
    }

    public void setJenis(String jenisMobil) {
        this.jenisMobil = jenisMobil; 
    } 

    public Integer getHargaPerHari() {
        return hargaPerHari;
    }

    public void setHargaPerHari(Integer hargaPerHari) {
        this.hargaPerHari = hargaPerHari; 
    }

    public Integer getKapasitas() {
        return kapasitas;
    }

    public void setKapasitas(Integer kapasitas) {
        this.kapasitas = kapasitas; 
    }

    public String getStatus() {
        return status; 
    }

    public void setStatus(String status) {
        this.status = status; 
    }


}

