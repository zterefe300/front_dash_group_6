package com.frontdash.repository;

import com.frontdash.entity.RestaurantLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantLoginRepository extends JpaRepository<RestaurantLogin, String> {

    Optional<RestaurantLogin> findByUsername(String username);

    Optional<RestaurantLogin> findByRestaurantId(Integer restaurantId);

    boolean existsByUsername(String username);
}
