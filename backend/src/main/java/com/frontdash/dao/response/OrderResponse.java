package com.frontdash.dao.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.frontdash.entity.Orders;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private String orderId;
    private RestaurantResponse restaurant;
    private String customerName;
    private String customerPhone;
    private AddressResponse deliveryAddress;
    private BigDecimal totalAmount;
    private LocalDateTime orderTime;
    private DriverResponse assignedDriver;
    private LocalDateTime estimatedDeliveryTime;
    private Orders.OrderStatus orderStatus;
    private BigDecimal tips;
    private BigDecimal subtotal;
    private LocalDateTime deliveryTime;
    private List<MenuItemResponse> items;
}
