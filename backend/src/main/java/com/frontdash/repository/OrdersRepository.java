package com.frontdash.repository;

import com.frontdash.entity.Orders;
import com.frontdash.entity.Orders.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findByRestaurantId(Integer restaurantId);
    List<Orders> findByAssignedDriverId(Integer driverId);
    List<Orders> findByOrderStatus(OrderStatus status);
}
