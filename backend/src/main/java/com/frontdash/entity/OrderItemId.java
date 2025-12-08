package com.frontdash.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemId implements Serializable {
    private String orderId;
    private Integer menuItemId;
}
