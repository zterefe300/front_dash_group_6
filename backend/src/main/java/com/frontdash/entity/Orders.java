package com.frontdash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orders {

    @Id
    @Column(name = "order_id")
    private String orderId;

    @Column(name = "restaurant_id")
    private Integer restaurantId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "address_id")
    private Integer addressId;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "order_time", nullable = false)
    private LocalDateTime orderTime;

    @Column(name = "assigned_driver_id")
    private Integer assignedDriverId;

    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    @Builder.Default
    private OrderStatus orderStatus = OrderStatus.PENDING;

    @Column(name = "tips")
    private BigDecimal tips;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "delivery_time")
    private LocalDateTime deliveryTime;

    public enum OrderStatus {
        PENDING,
        OUT_FOR_DELIVERY,
        DELIVERED
    }
}
