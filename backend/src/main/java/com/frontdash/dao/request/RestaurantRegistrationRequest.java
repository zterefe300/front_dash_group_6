package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request model for restaurant registration
 * Maps to frontend RegistrationPage form data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRegistrationRequest {

    private String name;
    private String pictureUrl;

    private String contactPersonName;
    private String emailAddress;
    private String phoneNumber;


    private AddressRequest address;
    // Business Address
    private String building;
    private String street;
    private String city;
    private String state;
    private String zipCode;

    // Menu Items
    private List<MenuItemRequest> menuItems;

    // Operating Hours
    private List<OperatingHourRequest> operatingHours;

    // Supporting Documents
    private List<String> supportingFiles;

    // Agreements
    private Boolean agreeToTerms;
    private Boolean agreeToCommission;
    private Boolean confirmAccuracy;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MenuItemRequest {
        private String name;
        private String category;
        private Double price;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OperatingHourRequest {
        private String day;
        private Boolean isOpen;
        private String openTime;
        private String closeTime;
    }
}
