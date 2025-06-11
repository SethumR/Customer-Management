package com.example.customermanagement.model;

import lombok.Data;
import javax.persistence.*;

@Entity
@Data
@Table(name = "mobile_numbers")
public class MobileNumber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String number;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public void setCustomer(Customer customer) {

    }
}