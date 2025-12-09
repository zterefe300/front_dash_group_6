package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLoginResponse {

    private boolean success;
    private String message;
    private String role;
    private boolean forcePasswordChange;
}
