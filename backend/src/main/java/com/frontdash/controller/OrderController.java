package com.frontdash.controller;

import com.frontdash.dao.request.OrderRequest;
import com.frontdash.dao.response.OrderResponse;
import com.frontdash.entity.Orders;
import com.frontdash.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Managment", description = "APIs for order related operations")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        OrderResponse resp = orderService.createOrder(request);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String id) {
        System.out.println("Fetching order with ID: " + id);
        OrderResponse resp = orderService.getOrderById(id);
        if (resp == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(resp);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestParam(required = false) Integer restaurantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean hasDriver) {
        if (restaurantId != null) {
            return ResponseEntity.ok(orderService.getOrdersByRestaurantId(restaurantId));
        }
        if (status != null) {
            Orders.OrderStatus orderStatus = Orders.OrderStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(orderService.getOrdersByStatus(orderStatus, hasDriver));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/{id}/assign-driver")
    public ResponseEntity<OrderResponse> assignDriver(@PathVariable String id, @RequestParam Integer driverId) {
        OrderResponse resp = orderService.assignDriver(id, driverId);
        return ResponseEntity.ok(resp);
    }

    @PatchMapping("/{id}/delivery")
    public ResponseEntity<OrderResponse> setDeliveryTime(@PathVariable String id,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime deliveryTime) {
        OrderResponse resp = orderService.updateDeliveryTime(id, deliveryTime);
        return ResponseEntity.ok(resp);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable String id, @RequestParam String status) {
        Orders.OrderStatus orderStatus = Orders.OrderStatus.valueOf(status.toUpperCase());
        OrderResponse resp = orderService.updateOrderStatus(id, orderStatus);
        return ResponseEntity.ok(resp);
    }
}
