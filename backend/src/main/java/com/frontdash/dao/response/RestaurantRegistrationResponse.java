package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response model for restaurant registration
 * Returns application status to frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRegistrationResponse {

    private String id;
    private String status;
    private String message;
    private LocalDateTime submittedAt;
    private String generatedUsername;
}
