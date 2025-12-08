package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {
    private String building;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
}
