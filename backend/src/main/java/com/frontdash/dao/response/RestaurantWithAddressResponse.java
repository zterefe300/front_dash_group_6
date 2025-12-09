package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantWithAddressResponse {
    private Integer restaurantId;
    private String name;
    private String pictureUrl;
    private String phoneNumber;
    private String contactPersonName;
    private String emailAddress;
    private String status;
    private AddressResponse address;
}
