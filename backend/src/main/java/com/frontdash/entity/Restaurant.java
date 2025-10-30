package com.frontdash.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Restaurant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id")
    private Integer restaurantId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "cuisine_type")
    private String cuisineType;

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(name = "address_id")
    private Integer addressId;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "contact_person_name")
    private String contactPersonName;

    @Column(name = "email_address")
    private String emailAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RestaurantStatus status = RestaurantStatus.NEW_REG;

    public enum RestaurantStatus {
        NEW_REG,
        ACTIVE,
        WITHDRAW_REQ
    }
}
