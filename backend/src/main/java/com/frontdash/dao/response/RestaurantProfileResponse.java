package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantProfileResponse {
    private Integer restaurantId;
    private String name;
    private String description;
    private String businessType;
    private String contactName;
    private String phoneNumber;
    private String email;
    private String status;
    private AddressResponse address;
    private List<OperatingHourResponse> operatingHours;
}
