package com.frontdash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "ServiceCharge")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCharge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_charge_id")
    private Integer serviceChargeId;

    @Column(name = "percentage", nullable = false)
    @Builder.Default
    private BigDecimal percentage = new BigDecimal("8.25");
}
