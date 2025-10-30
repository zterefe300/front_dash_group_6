package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponse {

    private Integer menuItemId;
    private Integer categoryId;
    private String itemName;
    private String pictureUrl;
    private BigDecimal price;
    private String availability;
}
