package com.frontdash.repository;

import com.frontdash.entity.OperatingHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OperatingHourRepository extends JpaRepository<OperatingHour, Integer> {

    List<OperatingHour> findByRestaurantId(Integer restaurantId);

    Optional<OperatingHour> findByRestaurantIdAndWeekDay(Integer restaurantId, String weekDay);
}
