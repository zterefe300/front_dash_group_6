package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request model for updating restaurant basic profile information
 * Maps to frontend RestaurantProfile page
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantProfileUpdateRequest {

    private String name;
    private String description;
    private String businessType;
}
