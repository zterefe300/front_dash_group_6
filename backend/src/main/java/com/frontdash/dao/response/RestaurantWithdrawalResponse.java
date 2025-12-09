package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response model for restaurant withdrawal request
 * Returns withdrawal application status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantWithdrawalResponse {

    private String id;
    private String reason;
    private String details;
    private String status;  // pending, processing, completed, cancelled
    private LocalDateTime createdAt;
    private String message;
}
