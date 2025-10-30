package com.frontdash.repository;

import com.frontdash.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    // Find restaurant by name
    Optional<Restaurant> findByName(String name);

    // Find restaurants by status
    List<Restaurant> findByStatus(Restaurant.RestaurantStatus status);

    // Update restaurant status by ID
    @Modifying
    @Query("UPDATE Restaurant r SET r.status = :status WHERE r.restaurantId = :restaurantId")
    int updateRestaurantStatus(@Param("restaurantId") Integer restaurantId, @Param("status") Restaurant.RestaurantStatus status);

    // Check if restaurant name exists
    boolean existsByName(String name);

    // Find restaurants by email address
    Optional<Restaurant> findByEmailAddress(String emailAddress);

    // Find restaurants by phone number
    Optional<Restaurant> findByPhoneNumber(String phoneNumber);
}
