package com.frontdash.repository;

import com.frontdash.entity.Orders;
import com.frontdash.entity.Orders.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, String> {
    List<Orders> findByRestaurantId(Integer restaurantId);
    List<Orders> findByAssignedDriverId(Integer driverId);
    List<Orders> findByOrderStatus(OrderStatus status);
    List<Orders> findByOrderStatusAndAssignedDriverIdIsNull(OrderStatus status);
    List<Orders> findByOrderStatusAndAssignedDriverIdIsNotNull(OrderStatus status);
}
