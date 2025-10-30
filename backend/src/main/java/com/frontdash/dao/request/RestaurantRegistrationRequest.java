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
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private Integer addressId;
    private String phoneNumber;
    private String contactPersonName;
    private String emailAddress;

}
