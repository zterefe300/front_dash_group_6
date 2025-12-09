package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRegistrationRequest {

    private String name;
    private String cuisineType;
    private String pictureUrl;
    private AddressRequest address;
    private String phoneNumber;
    private String contactPersonName;
    private String emailAddress;

}
