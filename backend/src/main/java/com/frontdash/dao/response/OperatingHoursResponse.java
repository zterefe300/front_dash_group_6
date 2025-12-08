package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response model for operating hours
 * Returns weekly schedule to frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatingHoursResponse {

    private List<DayHours> hours;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DayHours {
        private String day;
        private Boolean isOpen;
        private String openTime;
        private String closeTime;
    }
}
