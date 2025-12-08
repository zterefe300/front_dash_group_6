package com.frontdash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "OrderItem")
@IdClass(OrderItemId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @Column(name = "order_id")
    private String orderId;

    @Id
    @Column(name = "menu_item_id")
    private Integer menuItemId;

    @Column(nullable = false)
    private Integer quantity;
}
