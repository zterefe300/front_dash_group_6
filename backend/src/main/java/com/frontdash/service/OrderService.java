package com.frontdash.service;

import com.frontdash.dao.request.OrderRequest;
import com.frontdash.dao.response.OrderResponse;
import com.frontdash.entity.OrderItem;
import com.frontdash.entity.Orders;
import com.frontdash.repository.OrderItemRepository;
import com.frontdash.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    

    public OrderResponse createOrder(OrderRequest request) {
        // If an addressId is not provided, the caller should create the address first via AddressService.

        BigDecimal subtotal = request.getSubtotal() == null ? BigDecimal.ZERO : request.getSubtotal();
        BigDecimal tips = request.getTips() == null ? BigDecimal.ZERO : request.getTips();
        BigDecimal total = subtotal.add(tips);

        Orders order = Orders.builder()
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
        return toResponse(updated);
    }

    public OrderResponse updateDeliveryTime(String orderId, LocalDateTime deliveryTime) {
        Orders order = ordersRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setDeliveryTime(deliveryTime);
        order.setOrderStatus(Orders.OrderStatus.DELIVERED);
        Orders updated = ordersRepository.save(order);
        return toResponse(updated);
    }

    public List<OrderResponse> getAllOrders() {
        return ordersRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private OrderResponse toResponse(Orders o) {
        return OrderResponse.builder()
                .orderId(o.getOrderId())
                .restaurantId(o.getRestaurantId())
                .customerName(o.getCustomerName())
                .customerPhone(o.getCustomerPhone())
                .addressId(o.getAddressId())
                .totalAmount(o.getTotalAmount())
                .orderTime(o.getOrderTime())
                .assignedDriverId(o.getAssignedDriverId())
                .estimatedDeliveryTime(o.getEstimatedDeliveryTime())
                .orderStatus(o.getOrderStatus())
                .tips(o.getTips())
                .subtotal(o.getSubtotal())
                .deliveryTime(o.getDeliveryTime())
                .items(null)
                .build();
    }
}
