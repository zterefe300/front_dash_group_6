package com.frontdash.service;

import com.frontdash.dao.request.AddressRequest;
import com.frontdash.dao.request.MenuUpdateRequest;
import com.frontdash.dao.request.OperatingHourEntryRequest;
import com.frontdash.dao.request.OperatingHoursUpdateRequest;
import com.frontdash.dao.request.RestaurantRegistrationRequest;
import com.frontdash.dao.request.RestaurantWithdrawalRequest;
import com.frontdash.dao.response.MenuItemResponse;
import com.frontdash.dao.response.OperatingHourResponse;
import com.frontdash.dao.response.RestaurantResponse;
import com.frontdash.entity.*;
import com.frontdash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    private static final DateTimeFormatter TIME_FORMATTER_WITH_SECONDS = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final DateTimeFormatter TIME_FORMATTER_NO_SECONDS = DateTimeFormatter.ofPattern("HH:mm");

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private RestaurantLoginRepository restaurantLoginRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @Autowired
    private OperatingHourRepository operatingHourRepository;

    @Autowired
    private AddressRepository addressRepository;

    public List<RestaurantResponse> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        return restaurants.stream()
                .map(this::convertToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public RestaurantResponse registerRestaurant(RestaurantRegistrationRequest request) {
        if (request.getName() == null ) {
            throw new IllegalArgumentException("Restaurant name are required");
        }

        if (restaurantRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Restaurant name already exists");
        }

        if (request.getEmailAddress() != null) {
            restaurantRepository.findByEmailAddress(request.getEmailAddress())
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("Restaurant email already exists");
                    });
        }

        if (request.getPhoneNumber() != null) {
            restaurantRepository.findByPhoneNumber(request.getPhoneNumber())
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("Restaurant phone number already exists");
                    });
        }

        final AddressRequest addressRequest = request.getAddress();
        Address address = Address.builder()
                .streetAddress(addressRequest.getStreetAddress())
                .city(addressRequest.getCity())
                .state(addressRequest.getState())
                .zipCode(addressRequest.getZipCode())
                .build();
        addressRepository.save(address);
        
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .cuisineType(request.getCuisineType())
                .pictureUrl(request.getPictureUrl())
                .addressId(address.getAddressId())
                .phoneNumber(request.getPhoneNumber())
                .contactPersonName(request.getContactPersonName())
                .emailAddress(request.getEmailAddress())
                .status(Restaurant.RestaurantStatus.NEW_REG)
                .build();

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        return convertToResponse(savedRestaurant);
    }

    @Transactional
    public MenuItemResponse updateMenuItem(Integer restaurantId, MenuUpdateRequest request) {
        if (request.getMenuItemId() == null) {
            throw new IllegalArgumentException("Menu item ID is required");
        }

        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndRestaurantId(request.getMenuItemId(), restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found for restaurant"));

        if (request.getCategoryId() != null && !request.getCategoryId().equals(menuItem.getCategoryId())) {
            MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu category not found"));

            if (!category.getRestaurantId().equals(restaurantId)) {
                throw new IllegalArgumentException("Category does not belong to restaurant");
            }
            menuItem.setCategoryId(request.getCategoryId());
        }

        if (request.getItemName() != null) {
            menuItem.setItemName(request.getItemName());
        }

        if (request.getPictureUrl() != null) {
            menuItem.setPictureUrl(request.getPictureUrl());
        }

        if (request.getPrice() != null) {
            menuItem.setPrice(request.getPrice());
        }

        if (request.getAvailability() != null) {
            menuItem.setAvailability(MenuItem.AvailabilityStatus.valueOf(request.getAvailability()));
        }

        MenuItem updated = menuItemRepository.save(menuItem);
        return convertToResponse(updated);
    }

    @Transactional
    public List<OperatingHourResponse> updateOperatingHours(Integer restaurantId, OperatingHoursUpdateRequest request) {
        if (request.getHours() == null || request.getHours().isEmpty()) {
            throw new IllegalArgumentException("No operating hours provided");
        }

        List<OperatingHourResponse> responses = new ArrayList<>();
        for (OperatingHourEntryRequest entry : request.getHours()) {
            OperatingHour operatingHour;
            if (entry.getOperatingHourId() != null) {
                operatingHour = operatingHourRepository.findById(entry.getOperatingHourId())
                        .orElseThrow(() -> new IllegalArgumentException("Operating hour not found"));

                if (!operatingHour.getRestaurantId().equals(restaurantId)) {
                    throw new IllegalArgumentException("Operating hour does not belong to restaurant");
                }
            } else {
                // Check if operating hour already exists for this restaurant and week_day
                Optional<OperatingHour> existingHour = operatingHourRepository.findByRestaurantIdAndWeekDay(restaurantId, entry.getWeekDay());
                if (existingHour.isPresent()) {
                    operatingHour = existingHour.get();
                } else {
                    operatingHour = OperatingHour.builder()
                            .restaurantId(restaurantId)
                            .build();
                }
            }

            if (entry.getWeekDay() != null) {
                operatingHour.setWeekDay(entry.getWeekDay());
            } else if (operatingHour.getWeekDay() == null) {
                throw new IllegalArgumentException("Week day is required for operating hour entry");
            }

            LocalTime openTime = parseTime(entry.getOpenTime());
            LocalTime closeTime = parseTime(entry.getCloseTime());

            operatingHour.setOpenTime(openTime);
            operatingHour.setCloseTime(closeTime);

            OperatingHour saved = operatingHourRepository.save(operatingHour);
            responses.add(convertToResponse(saved));
        }
        return responses;
    }

    @Transactional
    public RestaurantResponse requestWithdrawal(RestaurantWithdrawalRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        if (restaurant.getStatus() != Restaurant.RestaurantStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active restaurants can request withdrawal");
        }

        restaurant.setStatus(Restaurant.RestaurantStatus.WITHDRAW_REQ);
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return convertToResponse(updatedRestaurant);
    }

    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .cuisineType(restaurant.getCuisineType())
                .pictureUrl(restaurant.getPictureUrl())
                .addressId(restaurant.getAddressId())
                .phoneNumber(restaurant.getPhoneNumber())
                .contactPersonName(restaurant.getContactPersonName())
                .emailAddress(restaurant.getEmailAddress())
                .status(restaurant.getStatus().name())
                .build();
    }

    private MenuItemResponse convertToResponse(MenuItem menuItem) {
        return MenuItemResponse.builder()
                .menuItemId(menuItem.getMenuItemId())
                .categoryId(menuItem.getCategoryId())
                .itemName(menuItem.getItemName())
                .pictureUrl(menuItem.getPictureUrl())
                .price(menuItem.getPrice())
                .availability(menuItem.getAvailability().name())
                .build();
    }

    private OperatingHourResponse convertToResponse(OperatingHour operatingHour) {
        return OperatingHourResponse.builder()
                .operatingHourId(operatingHour.getOperatingHourId())
                .restaurantId(operatingHour.getRestaurantId())
                .weekDay(operatingHour.getWeekDay())
                .openTime(operatingHour.getOpenTime().toString())
                .closeTime(operatingHour.getCloseTime().toString())
                .build();
    }

    public RestaurantResponse getRestaurantById(Integer restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        return convertToResponse(restaurant);
    }

    public MenuItemResponse getMenuItemById(Integer menuItemId) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
        return convertToResponse(menuItem);
    }

    private LocalTime parseTime(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Time value is required");
        }

        try {
            return LocalTime.parse(value, TIME_FORMATTER_WITH_SECONDS);
        } catch (DateTimeParseException ex) {
            return LocalTime.parse(value, TIME_FORMATTER_NO_SECONDS);
        }
    }
}
