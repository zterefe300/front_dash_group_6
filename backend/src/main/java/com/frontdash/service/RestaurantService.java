package com.frontdash.service;

import com.frontdash.dao.request.*;
import com.frontdash.dao.response.MenuItemResponse;
import com.frontdash.dao.response.OperatingHourResponse;
import com.frontdash.dao.response.RestaurantProfileResponse;
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

    @Transactional
    public RestaurantResponse registerRestaurant(RestaurantRegistrationRequest request) {
        if (request.getRestaurantName() == null ) {
            throw new IllegalArgumentException("Restaurant name are required");
        }

        if (restaurantRepository.existsByName(request.getRestaurantName())) {
            throw new IllegalArgumentException("Restaurant name already exists");
        }

        if (request.getEmail() != null) {
            restaurantRepository.findByEmailAddress(request.getEmail())
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("Restaurant email already exists");
                    });
        }

        if (request.getPhone() != null) {
            restaurantRepository.findByPhoneNumber(request.getPhone())
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("Restaurant phone number already exists");
                    });
        }

//        Address address = addressRepository.save(request.g());
//        System.out.println(address.toString());
//
//        Restaurant restaurant = Restaurant.builder()
//                .name(request.getName())
//                .cuisineType(request.getCuisineType())
//                .pictureUrl(request.getPictureUrl())
//                .addressId(address.getAddressId())
//                .phoneNumber(request.getPhoneNumber())
//                .contactPersonName(request.getContactPersonName())
//                .emailAddress(request.getEmailAddress())
//                .status(Restaurant.RestaurantStatus.NEW_REG)
//                .build();

        Restaurant savedRestaurant = null;
//        Restaurant savedRestaurant = restaurantRepository.save(restaurant);


        // after aprove, and insert the login username & password to restaurant table
//        RestaurantLogin restaurantLogin = RestaurantLogin.builder()
//                .restaurantId(savedRestaurant.getRestaurantId())
//                .build();
//        restaurantLoginRepository.save(restaurantLogin);

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
            menuItem.setAvailability(request.getAvailability());
        }

        MenuItem updated = menuItemRepository.save(menuItem);
        return convertToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getMenuItems(Integer restaurantId) {
        List<MenuCategory> categories = menuCategoryRepository.findByRestaurantId(restaurantId);
        List<MenuItemResponse> responses = new ArrayList<>();
        for (MenuCategory category : categories) {
            List<MenuItem> items = menuItemRepository.findByCategoryId(category.getCategoryId());
            for (MenuItem item : items) {
                responses.add(convertToResponse(item));
            }
        }
        return responses;
    }

    @Transactional
    public MenuItemResponse createMenuItem(Integer restaurantId, MenuItemCreateRequest request) {
        MenuCategory category = menuCategoryRepository
                .findByRestaurantIdAndCategoryName(restaurantId, request.getCategory())
                .orElseGet(() -> menuCategoryRepository.save(
                        MenuCategory.builder()
                                .restaurantId(restaurantId)
                                .categoryName(request.getCategory())
                                .build()
                ));

        MenuItem menuItem = MenuItem.builder()
                .categoryId(category.getCategoryId())
                .itemName(request.getName())
                .description(request.getDescription())
                .pictureUrl(request.getImageUrl())
                .price(request.getPrice())
                .availability(Boolean.TRUE.equals(request.getIsAvailable()) ? "available" : "unavailable")
                .build();

        MenuItem saved = menuItemRepository.save(menuItem);
        return convertToResponse(saved);
    }

    @Transactional
    public MenuItemResponse updateMenuItem(Integer restaurantId, Integer menuItemId, MenuItemUpdateRequest request) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndRestaurantId(menuItemId, restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found for restaurant"));

        if (request.getCategory() != null) {
            MenuCategory category = menuCategoryRepository
                    .findByRestaurantIdAndCategoryName(restaurantId, request.getCategory())
                    .orElseGet(() -> menuCategoryRepository.save(
                            MenuCategory.builder()
                                    .restaurantId(restaurantId)
                                    .categoryName(request.getCategory())
                                    .build()
                    ));
            menuItem.setCategoryId(category.getCategoryId());
        }

        if (request.getName() != null) {
            menuItem.setItemName(request.getName());
        }
        if (request.getDescription() != null) {
            menuItem.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            menuItem.setPictureUrl(request.getImageUrl());
        }
        if (request.getPrice() != null) {
            menuItem.setPrice(request.getPrice());
        }
        if (request.getIsAvailable() != null) {
            menuItem.setAvailability(request.getIsAvailable() ? "available" : "unavailable");
        }

        MenuItem saved = menuItemRepository.save(menuItem);
        return convertToResponse(saved);
    }

    @Transactional
    public void deleteMenuItem(Integer restaurantId, Integer menuItemId) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndRestaurantId(menuItemId, restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found for restaurant"));
        menuItemRepository.delete(menuItem);
    }

    @Transactional
    public void updateMenuItemAvailability(Integer restaurantId, Integer menuItemId, boolean isAvailable) {
        MenuItem menuItem = menuItemRepository.findByMenuItemIdAndRestaurantId(menuItemId, restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found for restaurant"));
        menuItem.setAvailability(isAvailable ? "available" : "unavailable");
        menuItemRepository.save(menuItem);
    }

    @Transactional(readOnly = true)
    public List<MenuCategory> getCategories(Integer restaurantId) {
        return menuCategoryRepository.findByRestaurantId(restaurantId);
    }

    @Transactional
    public MenuCategory createCategory(Integer restaurantId, MenuCategoryCreateRequest request) {
        if (request.getCategoryName() == null || request.getCategoryName().isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }
        Optional<MenuCategory> existing = menuCategoryRepository.findByRestaurantIdAndCategoryName(
                restaurantId, request.getCategoryName());
        if (existing.isPresent()) {
            return existing.get();
        }
        MenuCategory category = MenuCategory.builder()
                .restaurantId(restaurantId)
                .categoryName(request.getCategoryName())
                .build();
        return menuCategoryRepository.save(category);
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

    @Transactional(readOnly = true)
    public RestaurantProfileResponse getRestaurantProfile(Integer restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        Address address = null;
        if (restaurant.getAddressId() != null) {
            address = addressRepository.findById(restaurant.getAddressId()).orElse(null);
        }

        List<OperatingHourResponse> hours = getOperatingHours(restaurantId);

        return RestaurantProfileResponse.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .businessType(restaurant.getBusinessType() != null ? restaurant.getBusinessType() : restaurant.getCuisineType())
                .contactName(restaurant.getContactPersonName())
                .phoneNumber(restaurant.getPhoneNumber())
                .email(restaurant.getEmailAddress())
                .status(restaurant.getStatus().name())
                .address(address != null ? com.frontdash.dao.response.AddressResponse.builder()
                        .addressId(address.getAddressId())
                        .streetAddress(address.getStreetAddress())
                        .city(address.getCity())
                        .state(address.getState())
                        .zipCode(address.getZipCode())
                        .build() : null)
                .operatingHours(hours)
                .build();
    }

    @Transactional
    public RestaurantProfileResponse updateRestaurantProfile(Integer restaurantId, RestaurantRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        if (request.getName() != null) {
            restaurant.setName(request.getName());
        }

        if (request.getCuisineType() != null) {
            restaurant.setBusinessType(request.getCuisineType());
            restaurant.setCuisineType(request.getCuisineType());
        }

        restaurantRepository.save(restaurant);
        return getRestaurantProfile(restaurantId);
    }

    @Transactional
    public RestaurantProfileResponse updateContact(Integer restaurantId, RestaurantContactUpdateRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        if (request.getContactName() != null) {
            restaurant.setContactPersonName(request.getContactName());
        }
        if (request.getPhoneNumber() != null) {
            restaurant.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getEmail() != null) {
            restaurant.setEmailAddress(request.getEmail());
        }

        restaurantRepository.save(restaurant);
        return getRestaurantProfile(restaurantId);
    }

    @Transactional
    public RestaurantProfileResponse updateAddress(Integer restaurantId, RestaurantAddressUpdateRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        Address address;
        if (restaurant.getAddressId() != null) {
            address = addressRepository.findById(restaurant.getAddressId()).orElse(Address.builder().build());
            address.setAddressId(restaurant.getAddressId());
        } else {
            address = Address.builder().build();
        }

        address.setBldg(request.getBuilding());
        address.setStreetAddress(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZipCode(request.getZipCode());

        Address saved = addressRepository.save(address);
        restaurant.setAddressId(saved.getAddressId());
        restaurantRepository.save(restaurant);

        return getRestaurantProfile(restaurantId);
    }

    @Transactional(readOnly = true)
    public List<OperatingHourResponse> getOperatingHours(Integer restaurantId) {
        List<OperatingHour> operatingHours = operatingHourRepository.findByRestaurantId(restaurantId);
        List<OperatingHourResponse> responses = new ArrayList<>();
        for (OperatingHour hour : operatingHours) {
            responses.add(convertToResponse(hour));
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
        String categoryName = null;
        if (menuItem.getCategoryId() != null) {
            categoryName = menuCategoryRepository.findById(menuItem.getCategoryId())
                    .map(MenuCategory::getCategoryName)
                    .orElse(null);
        }
        return MenuItemResponse.builder()
                .menuItemId(menuItem.getMenuItemId())
                .categoryId(menuItem.getCategoryId())
                .categoryName(categoryName)
                .itemName(menuItem.getItemName())
                .description(menuItem.getDescription())
                .pictureUrl(menuItem.getPictureUrl())
                .price(menuItem.getPrice())
                .availability(menuItem.getAvailability())
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
