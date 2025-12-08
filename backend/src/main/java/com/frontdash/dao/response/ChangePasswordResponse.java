package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response model for password change
 * Returns status of password update operation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordResponse {

    private Boolean success;
    private String message;
}
