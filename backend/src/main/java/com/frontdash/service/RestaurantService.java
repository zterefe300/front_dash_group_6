package com.frontdash.service;

import com.frontdash.dao.request.*;
import com.frontdash.dao.response.*;
import com.frontdash.entity.*;
import com.frontdash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthService authService;

    public List<RestaurantResponse> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        return restaurants.stream()
                .map(this::convertToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public RestaurantRegistrationResponse registerRestaurant(RestaurantRegistrationRequest request) {

        System.out.println("[RestaurantRegister] Start register restaurant.");
        System.out.println("[Request] " + request);

        try {

            // 1. validate
            System.out.println("[Step1] Validate basic fields");

            if (request.getName() == null || request.getName().isBlank()) {
                System.out.println("[Error] Restaurant name is null");
                throw new IllegalArgumentException("Restaurant name is required");
            }

            if (restaurantRepository.existsByName(request.getName())) {
                System.out.println("[Error] Restaurant name already exists: " + request.getName());
                throw new IllegalArgumentException("Restaurant name already exists");
            }

            if (request.getEmailAddress() != null) {
                System.out.println("[Check] Email uniqueness: " + request.getEmailAddress());
                restaurantRepository.findByEmailAddress(request.getEmailAddress())
                        .ifPresent(existing -> {
                            System.out.println("[Error] Email already exists: " + request.getEmailAddress());
                            throw new IllegalArgumentException("Restaurant email already exists");
                        });
            }

            if (request.getPhoneNumber() != null) {
                System.out.println("[Check] Phone uniqueness: " + request.getPhoneNumber());
                restaurantRepository.findByPhoneNumber(request.getPhoneNumber())
                        .ifPresent(existing -> {
                            System.out.println("[Error] Phone number already exists: " + request.getPhoneNumber());
                            throw new IllegalArgumentException("Restaurant phone number already exists");
                        });
            }

            // 2. save Address
            System.out.println("[Step2] Save Address");

//            if (request.getAddress() == null) {
//                System.out.println("[Error] Address is null");
//                throw new IllegalArgumentException("Restaurant address is required");
//            }
//
//            System.out.println("[Address] " + request.getAddress());

            Address address = Address.builder()
                    .bldg(request.getBuilding())
                    .streetAddress(request.getStreet())
                    .city(request.getCity())
                    .state(request.getState())
                    .zipCode(request.getZipCode())
                    .build();

            Address savedAddress = addressRepository.save(address);
            System.out.println("[Saved Address ID] " + savedAddress.getAddressId());

            // 3. save Restaurant
            System.out.println("[Step3] Save Restaurant");

            String pictureUrl = null;
            if (request.getSupportingFiles() != null && !request.getSupportingFiles().isEmpty()) {
                pictureUrl = request.getSupportingFiles().get(0);
            }
            System.out.println("[PictureUrl] " + pictureUrl);

            Restaurant restaurant = Restaurant.builder()
                    .name(request.getName())
                    .cuisineType(request.getCuisineType())
                    .businessType(request.getCuisineType())
                    .pictureUrl(pictureUrl)
                    .addressId(savedAddress.getAddressId())
                    .phoneNumber(request.getPhoneNumber())
                    .contactPersonName(request.getContactPersonName())
                    .emailAddress(request.getEmailAddress())
                    .status(Restaurant.RestaurantStatus.NEW_REG)
                    .build();

            System.out.println("[Restaurant to save] " + restaurant);

            Restaurant savedRestaurant = restaurantRepository.save(restaurant);
            Integer restaurantId = savedRestaurant.getRestaurantId();
            System.out.println("[Saved Restaurant ID] " + restaurantId);

            // 4. save OperatingHour
            System.out.println("[Step4] Save OperatingHours");

            if (request.getOperatingHours() != null && !request.getOperatingHours().isEmpty()) {

                List<OperatingHour> hours = new ArrayList<>();
                for (RestaurantRegistrationRequest.OperatingHourRequest h : request.getOperatingHours()) {
                    System.out.println("[OperatingHour Request] " + h);

                    if (h.getDay() == null || h.getDay().isBlank()) {
                        System.out.println("[Skip] OperatingHour missing day: " + h);
                        continue;
                    }

                    LocalTime open = (h.getOpenTime() == null || h.getOpenTime().isBlank())
                            ? null : LocalTime.parse(h.getOpenTime());
                    LocalTime close = (h.getCloseTime() == null || h.getCloseTime().isBlank())
                            ? null : LocalTime.parse(h.getCloseTime());

                    OperatingHour hour = OperatingHour.builder()
                            .restaurantId(restaurantId)
                            .weekDay(h.getDay().toUpperCase())
                            .openTime(open)
                            .closeTime(close)
                            .build();

                    hours.add(hour);
                }

                if (!hours.isEmpty()) {
                    operatingHourRepository.saveAll(hours);
                    System.out.println("[Saved OperatingHours Count] " + hours.size());
                } else {
                    System.out.println("[OperatingHours] No valid hours to save");
                }
            }

            // 5. save MenuCategory + MenuItem
            System.out.println("[Step5] Save MenuCategories & MenuItems");

            if (request.getMenuItems() != null && !request.getMenuItems().isEmpty()) {

                Map<String, List<RestaurantRegistrationRequest.MenuItemRequest>> itemsByCategory =
                        request.getMenuItems().stream()
                                .collect(Collectors.groupingBy(RestaurantRegistrationRequest.MenuItemRequest::getCategory));

                System.out.println("[Menu Categories Found] " + itemsByCategory.keySet());

                for (Map.Entry<String, List<RestaurantRegistrationRequest.MenuItemRequest>> entry : itemsByCategory.entrySet()) {
                    String categoryName = entry.getKey();
                    List<RestaurantRegistrationRequest.MenuItemRequest> itemsInThisCategory = entry.getValue();

                    System.out.println("[Saving Category] " + categoryName + ", items=" + itemsInThisCategory.size());

                    MenuCategory category = MenuCategory.builder()
                            .restaurantId(restaurantId)
                            .categoryName(categoryName)
                            .build();

                    MenuCategory savedCategory = menuCategoryRepository.save(category);
                    Integer categoryId = savedCategory.getCategoryId();
                    System.out.println("[Saved Category ID] " + categoryId);

                    List<MenuItem> menuItems = itemsInThisCategory.stream()
                            .map(itemReq -> {
                                System.out.println("[MenuItem Request] " + itemReq);
                                return MenuItem.builder()
                                        .categoryId(categoryId)
                                        .itemName(itemReq.getName())  // 如果是 getItemName()，改这里
                                        .description(itemReq.getDescription())
                                        .price(new BigDecimal(itemReq.getPrice()))
                                        .availability(MenuItem.AvailabilityStatus.AVAILABLE)
                                        .build();
                            })
                            .collect(Collectors.toList());

                    menuItemRepository.saveAll(menuItems);
                    System.out.println("[Saved MenuItems Count] " + menuItems.size());
                }
            }

            // 6. save RestaurantLogin

            System.out.println("[Step6] Save RestaurantLogin");
            String givenLoginName = null;
            if (request.getContactPersonName() != null) {
                String contactPersonName = request.getContactPersonName();
                givenLoginName = generateUniqueUsername(contactPersonName);

                String givenPassword = "CS5336_" + contactPersonName;

                System.out.println("[Generated Login] username=" + givenLoginName +
                        ", password=" + givenPassword);

                RestaurantLogin login = RestaurantLogin.builder()
                        .username(givenLoginName)
                        .restaurantId(restaurantId)
                        .password(givenPassword)
                        .build();

                restaurantLoginRepository.save(login);
                System.out.println("[Saved RestaurantLogin]");
            }

            System.out.println("[RestaurantRegister] SUCCESS. restaurantId=" + restaurantId);


            return RestaurantRegistrationResponse
                    .builder()
                    .id(String.valueOf(restaurantId))
                    .generatedUsername(givenLoginName)
                    .submittedAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            System.out.println("[RestaurantRegister] ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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
                .availability(Boolean.TRUE.equals(request.getIsAvailable()) ? MenuItem.AvailabilityStatus.AVAILABLE : MenuItem.AvailabilityStatus.UNAVAILABLE)
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
            menuItem.setAvailability(request.getIsAvailable() ? MenuItem.AvailabilityStatus.AVAILABLE : MenuItem.AvailabilityStatus.UNAVAILABLE);
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
        menuItem.setAvailability(isAvailable ? MenuItem.AvailabilityStatus.AVAILABLE : MenuItem.AvailabilityStatus.UNAVAILABLE);
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


            String open = entry.getOpenTime();
            LocalTime openTime = (open == null || open.isBlank()) ? null : LocalTime.parse(open);

            String close = entry.getCloseTime();
            LocalTime closeTime = (close == null || close.isBlank()) ? null : LocalTime.parse(close);


            operatingHour.setOpenTime(openTime);
            operatingHour.setCloseTime(closeTime);

            OperatingHour saved = operatingHourRepository.save(operatingHour);
            System.out.println(saved.toString());
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
    public RestaurantProfileResponse updateRestaurantProfile(Integer restaurantId, RestaurantProfileUpdateRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        if (request.getName() != null) {
            restaurant.setName(request.getName());
        }

        if (request.getBusinessType() != null) {
            restaurant.setBusinessType(request.getBusinessType());
            restaurant.setCuisineType(request.getBusinessType());
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

        // Send email notification to restaurant
        if (restaurant.getEmailAddress() != null && !restaurant.getEmailAddress().isEmpty()) {
            try {
                String emailBody = String.format(
                    "Dear %s,\n\n" +
                    "We have received your withdrawal request with the following details:\n\n" +
                    "Reason: %s\n" +
                    "Details: %s\n\n" +
                    "Our team will review your request and contact you shortly.\n\n" +
                    "Best regards,\n" +
                    "FrontDash Team",
                    restaurant.getName(),
                    request.getReason(),
                    request.getDetails()
                );
                emailService.sendEmail(
                    restaurant.getEmailAddress(),
                    emailBody,
                    com.frontdash.dao.MessageType.RESTAURANT_WITHDRAWAL_REQUEST
                );
            } catch (Exception e) {
                // Log error but don't fail the withdrawal request
                System.err.println("Failed to send withdrawal confirmation email: " + e.getMessage());
            }
        }

        return convertToResponse(updatedRestaurant);
    }

    @Transactional
    public void changeRestaurantPassword(String username, String currentPassword, String newPassword) {
        authService.updateRestaurantPassword(username, currentPassword, newPassword);
    }

    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        RestaurantResponse.RestaurantResponseBuilder builder = RestaurantResponse.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .pictureUrl(restaurant.getPictureUrl())
                .addressId(restaurant.getAddressId())
                .phoneNumber(restaurant.getPhoneNumber())
                .contactPersonName(restaurant.getContactPersonName())
                .emailAddress(restaurant.getEmailAddress())
                .status(restaurant.getStatus().name());
        
        // Fetch and include address information if available
        if (restaurant.getAddressId() != null) {
            addressRepository.findById(restaurant.getAddressId()).ifPresent(address -> {
                builder.streetAddress(address.getStreetAddress())
                       .building(address.getBldg())
                       .city(address.getCity())
                       .state(address.getState())
                       .zipCode(address.getZipCode());
            });
        }
        
        return builder.build();
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
                .availability(menuItem.getAvailability().name())
                .build();
    }

    private OperatingHourResponse convertToResponse(OperatingHour operatingHour) {

        LocalTime open = operatingHour.getOpenTime();
        LocalTime close = operatingHour.getCloseTime();

        return OperatingHourResponse.builder()
                .operatingHourId(operatingHour.getOperatingHourId())
                .restaurantId(operatingHour.getRestaurantId())
                .weekDay(operatingHour.getWeekDay())
                .openTime(open == null ? null : open.toString())
                .closeTime(close == null ? null : close.toString())
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

    private String generateUniqueUsername(String contactPersonName) {
        if (contactPersonName == null || contactPersonName.isBlank()) {
            throw new IllegalArgumentException("Contact person name is required to generate username");
        }

        // 取 first name（按空格切分）并全部小写
        String firstName = contactPersonName.trim().split("\\s+")[0].toLowerCase();

        // 在 firstName 后面拼接两位数字 01 ~ 99
        for (int i = 1; i <= 99; i++) {
            String suffix = String.format("%02d", i);  // 01, 02, ..., 99
            String candidate = firstName + suffix;

            // 如果这个用户名还不存在，就用它
            boolean exists = restaurantLoginRepository.existsById(candidate);
            if (!exists) {
                return candidate;
            }
        }

        // 如果 01~99 都被占了，就报错（看你业务需求）
        throw new IllegalStateException("Cannot generate unique username for contact person: " + contactPersonName);
    }

}

