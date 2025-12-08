package com.frontdash.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frontdash.dao.request.OrderRequest;
import com.frontdash.dao.response.AddressResponse;
import com.frontdash.dao.response.DriverResponse;
import com.frontdash.dao.response.MenuItemResponse;
import com.frontdash.dao.response.OrderResponse;
import com.frontdash.dao.response.RestaurantResponse;
import com.frontdash.entity.Driver;
import com.frontdash.entity.OrderItem;
import com.frontdash.entity.Orders;
import com.frontdash.repository.DriverRepository;
import com.frontdash.repository.OrderItemRepository;
import com.frontdash.repository.OrdersRepository;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private DriverService driverService;

    

    public OrderResponse createOrder(OrderRequest request) {
        // If an addressId is not provided, the caller should create the address first via AddressService.

        BigDecimal subtotal = request.getSubtotal() == null ? BigDecimal.ZERO : request.getSubtotal();
        BigDecimal tips = request.getTips() == null ? BigDecimal.ZERO : request.getTips();
        BigDecimal total = subtotal.add(tips);

        // Generate orderId in format "FD0001", "FD0002", etc.
        String orderId = generateOrderId();

        Orders order = Orders.builder()
                .orderId(orderId)
                .restaurantId(request.getRestaurantId())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .addressId(request.getAddressId())
                .subtotal(subtotal)
                .tips(tips)
                .totalAmount(total)
                .orderTime(LocalDateTime.now())
                .orderStatus(Orders.OrderStatus.PENDING)
                .build();

        Orders saved = ordersRepository.save(order);

        // Save items if present
        if (request.getItems() != null) {
            List<OrderItem> items = request.getItems().stream().map(i -> {
                OrderItem oi = new OrderItem();
                oi.setOrderId(saved.getOrderId());
                oi.setMenuItemId(i.getMenuItemId());
                oi.setQuantity(i.getQuantity());
                return oi;
            }).collect(Collectors.toList());
            orderItemRepository.saveAll(items);
        }

        return toResponse(saved);
    }

    public OrderResponse getOrderById(String id) {
        return ordersRepository.findById(id).map(this::toResponse).orElse(null);
    }

    public List<OrderResponse> getOrdersByRestaurantId(Integer restaurantId) {
        return ordersRepository.findByRestaurantId(restaurantId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderResponse assignDriver(String orderId, Integer driverId) {
        Orders order = ordersRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setAssignedDriverId(driverId);
        order.setOrderStatus(Orders.OrderStatus.OUT_FOR_DELIVERY);
        Orders updated = ordersRepository.save(order);

        Driver driver = driverRepository.findById(driverId).orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        driver.setAvailabilityStatus(Driver.AvailabilityStatus.BUSY);
        driverRepository.save(driver);
        
        return toResponse(updated);
    }

    public OrderResponse updateDeliveryTime(String orderId, LocalDateTime deliveryTime) {
        Orders order = ordersRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setDeliveryTime(deliveryTime);
        order.setOrderStatus(Orders.OrderStatus.DELIVERED);
        Orders updated = ordersRepository.save(order);
        return toResponse(updated);
    }

    public OrderResponse updateOrderStatus(String orderId, Orders.OrderStatus status) {
        Orders order = ordersRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setOrderStatus(status);
        Orders updated = ordersRepository.save(order);

        // If order is completed (delivered or not delivered), set driver back to available
        if ((status == Orders.OrderStatus.DELIVERED || status == Orders.OrderStatus.NOT_DELIVERED) && order.getAssignedDriverId() != null) {
            Driver driver = driverRepository.findById(order.getAssignedDriverId()).orElse(null);
            if (driver != null) {
                driver.setAvailabilityStatus(Driver.AvailabilityStatus.AVAILABLE);
                driverRepository.save(driver);
            }
        }

        return toResponse(updated);
    }

    public List<OrderResponse> getAllOrders() {
        return ordersRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByStatus(Orders.OrderStatus status, Boolean hasDriver) {
        List<Orders> orders;
        if (hasDriver == null) {
            orders = ordersRepository.findByOrderStatus(status);
        } else if (hasDriver) {
            orders = ordersRepository.findByOrderStatusAndAssignedDriverIdIsNotNull(status);
        } else {
            orders = ordersRepository.findByOrderStatusAndAssignedDriverIdIsNull(status);
        }
        return orders.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private String generateOrderId() {
        long rowCount = ordersRepository.count();
        int nextNumber = (int) rowCount + 1;
        if (nextNumber <= 999) {
            return String.format("FD%04d", nextNumber);
        } else if (nextNumber <= 9999) {
            return String.format("FD%04d", nextNumber);
        } else {
            return String.format("FD%05d", nextNumber);
        }
    }

    private OrderResponse toResponse(Orders o) {
        // Fetch order items and menu item details
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(o.getOrderId());
        List<MenuItemResponse> items = orderItems.stream()
                .map(oi -> {
                    try {
                        return restaurantService.getMenuItemById(oi.getMenuItemId());
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(item -> item != null)
                .collect(Collectors.toList());

        // Fetch restaurant, address, and driver details
        RestaurantResponse restaurant = null;
        try {
            restaurant = restaurantService.getRestaurantById(o.getRestaurantId());
        } catch (Exception e) {
            // Restaurant not found
        }

        AddressResponse deliveryAddress = null;
        try {
            deliveryAddress = addressService.getAddressById(o.getAddressId());
        } catch (Exception e) {
            // Address not found
        }

        DriverResponse assignedDriver = null;
        if (o.getAssignedDriverId() != null) {
            try {
                assignedDriver = driverService.getDriverById(o.getAssignedDriverId());
            } catch (Exception e) {
                // Driver not found
            }
        }

        return OrderResponse.builder()
                .orderId(o.getOrderId())
                .restaurant(restaurant)
                .customerName(o.getCustomerName())
                .customerPhone(o.getCustomerPhone())
                .deliveryAddress(deliveryAddress)
                .totalAmount(o.getTotalAmount())
                .orderTime(o.getOrderTime())
                .assignedDriver(assignedDriver)
                .estimatedDeliveryTime(o.getEstimatedDeliveryTime())
                .orderStatus(o.getOrderStatus())
                .tips(o.getTips())
                .subtotal(o.getSubtotal())
                .deliveryTime(o.getDeliveryTime())
                .items(items)
                .build();
    }
}
