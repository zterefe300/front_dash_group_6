package com.frontdash.dao.response;

import com.frontdash.entity.Orders;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Integer orderId;
    private Integer restaurantId;
    private String customerName;
    private String customerPhone;
    private Integer addressId;
    private BigDecimal totalAmount;
    private LocalDateTime orderTime;
    private Integer assignedDriverId;
    private LocalDateTime estimatedDeliveryTime;
    private Orders.OrderStatus orderStatus;
    private BigDecimal tips;
    private BigDecimal subtotal;
    private LocalDateTime deliveryTime;
    private List<?> items; // keep generic for now
}
