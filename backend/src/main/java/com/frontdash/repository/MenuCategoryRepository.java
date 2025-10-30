package com.frontdash.repository;

import com.frontdash.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Integer> {

    List<MenuCategory> findByRestaurantId(Integer restaurantId);

    Optional<MenuCategory> findByRestaurantIdAndCategoryName(Integer restaurantId, String categoryName);
}
