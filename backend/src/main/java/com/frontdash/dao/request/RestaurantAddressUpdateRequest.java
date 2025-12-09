package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request model for updating restaurant address
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantAddressUpdateRequest {

    private String building;
    private String street;
    private String city;
    private String state;
    private String zipCode;
}
