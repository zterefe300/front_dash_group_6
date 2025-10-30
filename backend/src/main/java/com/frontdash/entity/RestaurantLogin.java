package com.frontdash.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "RestaurantLogin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantLogin {

    @Id
    @Column(name = "user_name")
    private String username;

    @Column(name = "restaurant_id", nullable = false)
    private Integer restaurantId;

    @Column(name = "password", nullable = false)
    private String password;
}
