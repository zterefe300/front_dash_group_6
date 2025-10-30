package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffRequest {

    private String username;
    private String password;
    private String firstname;
    private String lastname;
}
