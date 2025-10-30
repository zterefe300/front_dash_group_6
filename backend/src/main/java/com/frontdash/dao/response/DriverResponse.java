package com.frontdash.dao.response;

import com.frontdash.entity.Driver;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {

    private Integer driverId;
    private String firstname;
    private String lastname;
    private Driver.AvailabilityStatus availabilityStatus;
}
