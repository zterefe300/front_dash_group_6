package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantLoginResponse {

    private boolean success;
    private String message;
    private String role;
    private Integer restaurantId;

    // Additional fields for frontend integration
    private String token;           // JWT token for authentication
    private String username;        // Username for display
    private String restaurantName;  // Restaurant name
    private String email;           // Email address
    private String status;          // Restaurant status (ACTIVE, NEW_REG, etc.)
}
