package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatingHourResponse {

    private Integer operatingHourId;
    private Integer restaurantId;
    private String weekDay;
    private String openTime;
    private String closeTime;
}
