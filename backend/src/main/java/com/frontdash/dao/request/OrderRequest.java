package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    private Integer restaurantId;
    private String customerName;
    private String customerPhone;
    private Integer addressId; // optional - if null, create via addressRequest
    private List<OrderItemRequest> items;
    private BigDecimal subtotal;
    private BigDecimal tips;
}
