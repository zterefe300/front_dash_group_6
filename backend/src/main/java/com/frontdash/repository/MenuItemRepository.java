package com.frontdash.repository;

import com.frontdash.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    List<MenuItem> findByCategoryId(Integer categoryId);

    @Query("""
            SELECT mi FROM MenuItem mi
            JOIN MenuCategory mc ON mi.categoryId = mc.categoryId
            WHERE mi.menuItemId = :menuItemId AND mc.restaurantId = :restaurantId
            """)
    Optional<MenuItem> findByMenuItemIdAndRestaurantId(@Param("menuItemId") Integer menuItemId,
                                                       @Param("restaurantId") Integer restaurantId);
}
