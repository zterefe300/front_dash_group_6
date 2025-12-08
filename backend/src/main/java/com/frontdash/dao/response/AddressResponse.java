package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Integer addressId;
    private String streetAddress;
    private String bldg;
    private String city;
    private String state;
    private String zipCode;
}
