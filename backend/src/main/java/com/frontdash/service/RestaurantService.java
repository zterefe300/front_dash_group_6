package com.frontdash.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frontdash.dao.request.MenuCategoryCreateRequest;
import com.frontdash.dao.request.MenuItemCreateRequest;
import com.frontdash.dao.request.MenuItemUpdateRequest;
import com.frontdash.dao.request.MenuUpdateRequest;
import com.frontdash.dao.request.OperatingHourEntryRequest;
import com.frontdash.dao.request.OperatingHoursUpdateRequest;
import com.frontdash.dao.request.RestaurantAddressUpdateRequest;
import com.frontdash.dao.request.RestaurantContactUpdateRequest;
import com.frontdash.dao.request.RestaurantProfileUpdateRequest;
import com.frontdash.dao.request.RestaurantRegistrationRequest;
import com.frontdash.dao.request.RestaurantWithdrawalRequest;
import com.frontdash.dao.response.AddressResponse;
import com.frontdash.dao.response.MenuItemResponse;
import com.frontdash.dao.response.OperatingHourResponse;
import com.frontdash.dao.response.RestaurantProfileResponse;
import com.frontdash.dao.response.RestaurantRegistrationResponse;
import com.frontdash.dao.response.RestaurantResponse;
import com.frontdash.dao.response.RestaurantWithAddressResponse;
import com.frontdash.entity.Address;
import com.frontdash.entity.MenuCategory;
import com.frontdash.entity.MenuItem;
import com.frontdash.entity.OperatingHour;
import com.frontdash.entity.Restaurant;
import com.frontdash.repository.AddressRepository;
import com.frontdash.repository.MenuCategoryRepository;
import com.frontdash.repository.MenuItemRepository;
import com.frontdash.repository.OperatingHourRepository;
import com.frontdash.repository.RestaurantLoginRepository;
import com.frontdash.repository.RestaurantRepository;

@Service
public class RestaurantService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantService.class);

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

    public List<RestaurantWithAddressResponse> getAllRestaurantsWithAddress() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        return restaurants.stream()
                .map(this::convertToRestaurantWithAddress)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public RestaurantRegistrationResponse registerRestaurant(RestaurantRegistrationRequest request) {
        logger.info("Starting restaurant registration for: {}", request.getName());

        try {
            validateRegistrationRequest(request);

            Address savedAddress = saveAddress(request);

            Restaurant savedRestaurant = saveRestaurant(request, savedAddress);

            Integer restaurantId = savedRestaurant.getRestaurantId();

            saveOperatingHours(request, restaurantId);

            saveMenuItems(request, restaurantId);

            sendRegistrationConfirmationEmail(request);

            return RestaurantRegistrationResponse
                    .builder()
                    .id(String.valueOf(restaurantId))
                    .generatedUsername(savedRestaurant.getContactPersonName())
                    .submittedAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            logger.error("Failed to register restaurant: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void validateRegistrationRequest(RestaurantRegistrationRequest request) {
        logger.debug("Validating registration request for restaurant: {}", request.getName());

        if (request.getName() == null || request.getName().isBlank()) {
            logger.error("Restaurant name is required");
            throw new IllegalArgumentException("Restaurant name is required");
        }

        if (restaurantRepository.existsByName(request.getName())) {
            logger.error("Restaurant name already exists: {}", request.getName());
            throw new IllegalArgumentException("Restaurant name already exists");
        }

        validateEmailUniqueness(request.getEmailAddress());
        validatePhoneUniqueness(request.getPhoneNumber());

        logger.debug("Registration request validation completed successfully");
    }

    private void validateEmailUniqueness(String email) {
        if (email != null) {
            logger.debug("Checking email uniqueness: {}", email);
            restaurantRepository.findByEmailAddress(email)
                    .ifPresent(existing -> {
                        logger.error("Email already exists: {}", email);
                        throw new IllegalArgumentException("Restaurant email already exists");
                    });
        }
    }

    private void validatePhoneUniqueness(String phone) {
        if (phone != null) {
            logger.debug("Checking phone uniqueness: {}", phone);
            restaurantRepository.findByPhoneNumber(phone)
                    .ifPresent(existing -> {
                        logger.error("Phone number already exists: {}", phone);
                        throw new IllegalArgumentException("Restaurant phone number already exists");
                    });
        }
    }

    private Address saveAddress(RestaurantRegistrationRequest request) {
        logger.debug("Saving address for restaurant: {}", request.getName());

        Address address = Address.builder()
                .bldg(request.getBuilding())
                .streetAddress(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .build();

        Address savedAddress = addressRepository.save(address);
        logger.info("Saved address with ID: {}", savedAddress.getAddressId());

        return savedAddress;
    }

    private Restaurant saveRestaurant(RestaurantRegistrationRequest request, Address address) {
        logger.debug("Saving restaurant entity");

        String pictureUrl = extractPictureUrl(request);

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .pictureUrl(pictureUrl)
                .addressId(address.getAddressId())
                .phoneNumber(request.getPhoneNumber())
                .contactPersonName(request.getContactPersonName())
                .emailAddress(request.getEmailAddress())
                .status(Restaurant.RestaurantStatus.NEW_REG)
                .build();

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        logger.info("Saved restaurant with ID: {}", savedRestaurant.getRestaurantId());

        return savedRestaurant;
    }

    private String extractPictureUrl(RestaurantRegistrationRequest request) {
        String pictureUrl = null;
        if (request.getSupportingFiles() != null && !request.getSupportingFiles().isEmpty()) {
            pictureUrl = request.getSupportingFiles().get(0);
        }
        logger.debug("Extracted picture URL: {}", pictureUrl);
        return pictureUrl;
    }

    private void saveOperatingHours(RestaurantRegistrationRequest request, Integer restaurantId) {
        logger.debug("Saving operating hours for restaurant ID: {}", restaurantId);

        if (request.getOperatingHours() == null || request.getOperatingHours().isEmpty()) {
            logger.debug("No operating hours to save");
            return;
        }

        List<OperatingHour> hours = new ArrayList<>();
        for (RestaurantRegistrationRequest.OperatingHourRequest hourRequest : request.getOperatingHours()) {
            logger.debug("Processing operating hour: {}", hourRequest);

            if (hourRequest.getDay() == null || hourRequest.getDay().isBlank()) {
                logger.warn("Skipping operating hour with missing day: {}", hourRequest);
                continue;
            }

            OperatingHour hour = createOperatingHour(hourRequest, restaurantId);
            hours.add(hour);
        }

        if (!hours.isEmpty()) {
            operatingHourRepository.saveAll(hours);
            logger.info("Saved {} operating hours", hours.size());
        } else {
            logger.debug("No valid operating hours to save");
        }
    }

    private OperatingHour createOperatingHour(RestaurantRegistrationRequest.OperatingHourRequest hourRequest, Integer restaurantId) {
        LocalTime openTime = parseTimeSafely(hourRequest.getOpenTime());
        LocalTime closeTime = parseTimeSafely(hourRequest.getCloseTime());

        return OperatingHour.builder()
                .restaurantId(restaurantId)
                .weekDay(hourRequest.getDay().toUpperCase())
                .openTime(openTime)
                .closeTime(closeTime)
                .build();
    }

    private LocalTime parseTimeSafely(String timeString) {
        if (timeString == null || timeString.isBlank()) {
            return null;
        }
        try {
            return LocalTime.parse(timeString);
        } catch (Exception e) {
            logger.warn("Failed to parse time: {}, using null", timeString);
            return null;
        }
    }

    private void saveMenuItems(RestaurantRegistrationRequest request, Integer restaurantId) {
        logger.debug("Saving menu items for restaurant ID: {}", restaurantId);

        if (request.getMenuItems() == null || request.getMenuItems().isEmpty()) {
            logger.debug("No menu items to save");
            return;
        }

        Map<String, List<RestaurantRegistrationRequest.MenuItemRequest>> itemsByCategory =
                request.getMenuItems().stream()
                        .collect(Collectors.groupingBy(RestaurantRegistrationRequest.MenuItemRequest::getCategory));

        logger.debug("Found menu categories: {}", itemsByCategory.keySet());

        for (Map.Entry<String, List<RestaurantRegistrationRequest.MenuItemRequest>> entry : itemsByCategory.entrySet()) {
            String categoryName = entry.getKey();
            List<RestaurantRegistrationRequest.MenuItemRequest> itemsInCategory = entry.getValue();

            logger.debug("Processing category '{}' with {} items", categoryName, itemsInCategory.size());

            MenuCategory savedCategory = saveMenuCategory(restaurantId, categoryName);
            saveMenuItemsForCategory(savedCategory.getCategoryId(), itemsInCategory);
        }
    }

    private MenuCategory saveMenuCategory(Integer restaurantId, String categoryName) {
        MenuCategory category = MenuCategory.builder()
                .restaurantId(restaurantId)
                .categoryName(categoryName)
                .build();

        MenuCategory savedCategory = menuCategoryRepository.save(category);
        logger.debug("Saved menu category '{}' with ID: {}", categoryName, savedCategory.getCategoryId());

        return savedCategory;
    }

    private void saveMenuItemsForCategory(Integer categoryId, List<RestaurantRegistrationRequest.MenuItemRequest> itemRequests) {
        List<MenuItem> menuItems = itemRequests.stream()
                .map(itemReq -> createMenuItem(itemReq, categoryId))
                .collect(Collectors.toList());

        menuItemRepository.saveAll(menuItems);
        logger.info("Saved {} menu items for category ID: {}", menuItems.size(), categoryId);
    }

    private MenuItem createMenuItem(RestaurantRegistrationRequest.MenuItemRequest itemRequest, Integer categoryId) {
        logger.debug("Creating menu item: {}", itemRequest.getName());

        return MenuItem.builder()
                .categoryId(categoryId)
                .itemName(itemRequest.getName())
                .description(itemRequest.getDescription())
                .price(new BigDecimal(itemRequest.getPrice()))
                .pictureUrl(itemRequest.getImageUrl())
                .availability(MenuItem.AvailabilityStatus.AVAILABLE)
                .build();
    }

    private void sendRegistrationConfirmationEmail(RestaurantRegistrationRequest request) {
        if (request.getEmailAddress() == null || request.getEmailAddress().isEmpty()) {
            logger.debug("No email address provided, skipping confirmation email");
            return;
        }

        try {
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Thank you for submitting your restaurant registration request for %s.\n\n" +
                "Registration Details:\n" +
                "- Restaurant Name: %s\n" +
                "- Contact Person: %s\n" +
                "- Phone: %s\n" +
                "- Email: %s\n\n" +
                "Your application is now under review. Our team will evaluate your submission and contact you shortly with the approval status.\n\n" +
                "If you have any questions, please feel free to contact our support team.\n\n" +
                "Best regards,\n" +
                "FrontDash Team",
                request.getContactPersonName(),
                request.getName(),
                request.getName(),
                request.getContactPersonName(),
                request.getPhoneNumber(),
                request.getEmailAddress()
            );
            emailService.sendEmail(
                request.getEmailAddress(),
                emailBody,
                com.frontdash.dao.MessageType.RESTAURANT_REGISTRATION_SUBMITTED
            );
            logger.info("Registration confirmation email sent to: {}", request.getEmailAddress());
        } catch (Exception e) {
            logger.error("Failed to send registration confirmation email: {}", e.getMessage(), e);
            // Log error but don't fail the registration
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
                .contactName(restaurant.getContactPersonName())
                .phoneNumber(restaurant.getPhoneNumber())
                .email(restaurant.getEmailAddress())
                .status(restaurant.getStatus().name())
                .imageUrl(restaurant.getPictureUrl())
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
        System.out.println(request.toString());
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        if (request.getName() != null) {
            restaurant.setName(request.getName());
        }

        if (request.getImageUrl() != null) {
            restaurant.setPictureUrl(request.getImageUrl());
        } else {
            restaurant.setPictureUrl(null);
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
        return RestaurantResponse.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .pictureUrl(restaurant.getPictureUrl())
                .addressId(restaurant.getAddressId())
                .phoneNumber(restaurant.getPhoneNumber())
                .contactPersonName(restaurant.getContactPersonName())
                .emailAddress(restaurant.getEmailAddress())
                .status(restaurant.getStatus().name())
                .build();
    }

    private RestaurantWithAddressResponse convertToRestaurantWithAddress(Restaurant restaurant) {
        AddressResponse addressResponse = null;
        if (restaurant.getAddressId() != null) {
            addressResponse = addressRepository.findById(restaurant.getAddressId())
                    .map(address -> AddressResponse.builder()
                            .addressId(address.getAddressId())
                            .streetAddress(address.getStreetAddress())
                            .bldg(address.getBldg())
                            .city(address.getCity())
                            .state(address.getState())
                            .zipCode(address.getZipCode())
                            .build())
                    .orElse(null);
        }

        return RestaurantWithAddressResponse.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .pictureUrl(restaurant.getPictureUrl())
                .phoneNumber(restaurant.getPhoneNumber())
                .contactPersonName(restaurant.getContactPersonName())
                .emailAddress(restaurant.getEmailAddress())
                .status(restaurant.getStatus().name())
                .address(addressResponse)
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
