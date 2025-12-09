package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * Request model for restaurant withdrawal application
 * Maps to frontend BusinessActions withdrawal dialog
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantWithdrawalRequest {

    private Integer restaurantId;

    @NotBlank(message = "Withdrawal reason is required")
    private String reason;

    @NotBlank(message = "Additional details are required")
    private String details;
}
