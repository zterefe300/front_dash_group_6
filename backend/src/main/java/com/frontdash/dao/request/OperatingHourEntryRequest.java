package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatingHourEntryRequest {

    private Integer operatingHourId;
    private String weekDay;
    private String openTime;
    private String closeTime;
}
