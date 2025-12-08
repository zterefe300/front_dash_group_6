package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request model for updating restaurant contact info
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantContactUpdateRequest {

    private String contactName;
    private String phoneNumber;
    private String email;
}
