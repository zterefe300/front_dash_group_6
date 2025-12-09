package com.frontdash.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frontdash.dao.response.RestaurantResponse;
import com.frontdash.entity.EmployeeLogin;
import com.frontdash.entity.MenuCategory;
import com.frontdash.entity.Orders;
import com.frontdash.entity.Restaurant;
import com.frontdash.entity.RestaurantLogin;
import com.frontdash.entity.ServiceCharge;
import com.frontdash.repository.EmployeeLoginRepository;
import com.frontdash.repository.MenuCategoryRepository;
import com.frontdash.repository.MenuItemRepository;
import com.frontdash.repository.OperatingHourRepository;
import com.frontdash.repository.OrderItemRepository;
import com.frontdash.repository.OrdersRepository;
import com.frontdash.repository.RestaurantLoginRepository;
import com.frontdash.repository.RestaurantRepository;
import com.frontdash.repository.ServiceChargeRepository;

@Service
@Transactional
public class AdminService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @Autowired
    private OperatingHourRepository operatingHourRepository;

    @Autowired
    private RestaurantLoginRepository restaurantLoginRepository;

    @Autowired
    private EmployeeLoginRepository employeeLoginRepository;

    @Autowired
    private ServiceChargeRepository serviceChargeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // Helper method to delete all related records for a restaurant
    private void deleteRestaurantRelatedRecords(Integer restaurantId) {
        // Delete in order to avoid foreign key constraint violations

        // 1. Delete OrderItem (depends on Orders and MenuItem)
        // First get all orders for this restaurant, then delete their order items
        List<Orders> orders = ordersRepository.findByRestaurantId(restaurantId);
        for (Orders order : orders) {
            orderItemRepository.deleteAll(orderItemRepository.findByOrderId(order.getOrderId()));
        }

        // 2. Delete Orders (depends on Restaurant)
        ordersRepository.deleteAll(orders);

        // 3. Delete MenuItem (depends on MenuCategory)
        // First get all menu categories for this restaurant, then delete their menu items
        List<MenuCategory> categories = menuCategoryRepository.findByRestaurantId(restaurantId);
        for (MenuCategory category : categories) {
            menuItemRepository.deleteAll(menuItemRepository.findByCategoryId(category.getCategoryId()));
        }

        // 4. Delete MenuCategory (depends on Restaurant)
        menuCategoryRepository.deleteAll(categories);

        // 5. Delete OperatingHour (depends on Restaurant)
        operatingHourRepository.deleteAll(operatingHourRepository.findByRestaurantId(restaurantId));

        // 6. Delete RestaurantLogin (depends on Restaurant)
        Optional<RestaurantLogin> restaurantLogin = restaurantLoginRepository.findByRestaurantId(restaurantId);
        restaurantLogin.ifPresent(restaurantLoginRepository::delete);
    }

    // Helper method to convert Restaurant entity to RestaurantResponse DTO
    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        return new RestaurantResponse(
                restaurant.getRestaurantId(),
                restaurant.getName(),
                restaurant.getPictureUrl(),
                restaurant.getAddressId(),
                restaurant.getPhoneNumber(),
                restaurant.getContactPersonName(),
                restaurant.getEmailAddress(),
                restaurant.getStatus().toString()
        );
    }

    /**
     * Approve a restaurant registration
     * @param restaurantId the ID of the restaurant to approve
     * @return RestaurantResponse with updated status
     * @throws IllegalArgumentException if restaurant not found or not in NEW_REG status
     */
    public RestaurantResponse approveRegistration(Integer restaurantId) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(restaurantId);
        if (optionalRestaurant.isPresent()) {
            Restaurant restaurant = optionalRestaurant.get();
            if (restaurant.getStatus() == Restaurant.RestaurantStatus.NEW_REG) {
                restaurant.setStatus(Restaurant.RestaurantStatus.ACTIVE);
                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);

                // Create restaurant login with auto-generated credentials

                String username = restaurant.getContactPersonName() + restaurantId;
                String rawPassword = UUID.randomUUID().toString().substring(0, 8); // Generate 8-character password
                String encodedPassword = passwordEncoder.encode(rawPassword);

                RestaurantLogin restaurantLogin = RestaurantLogin.builder()
                        .username(username)
                        .password(encodedPassword)
                        .restaurantId(restaurantId)
                        .isFirstLogin(true)
                        .build();

                restaurantLoginRepository.save(restaurantLogin);

                // Send approval email with credentials
                if (restaurant.getEmailAddress() != null && !restaurant.getEmailAddress().isEmpty()) {
                    try {
                        String emailBody = emailService.generateRestaurantCredentialsBody(username, rawPassword) +
                            "\n\nCongratulations! Your restaurant registration has been approved. " +
                            "You can now log in to the FrontDash system and start managing your restaurant operations.";
                        emailService.sendEmail(
                            restaurant.getEmailAddress(),
                            emailBody,
                            com.frontdash.dao.MessageType.RESTAURANT_REGISTRATION_APPROVAL
                        );
                        System.out.println("[Email] Approval notification sent to: " + restaurant.getEmailAddress());
                    } catch (Exception e) {
                        System.err.println("[Email] Failed to send approval email: " + e.getMessage());
                        e.printStackTrace();
                    }
                }

                return convertToResponse(updatedRestaurant);
            } else {
                throw new IllegalArgumentException("Restaurant is not in NEW_REG status");
            }
        } else {
            throw new IllegalArgumentException("Restaurant not found");
        }
    }

    /**
     * Reject a restaurant registration
     * @param restaurantId the ID of the restaurant to reject
     * @throws IllegalArgumentException if restaurant not found or not in NEW_REG status
     */
    public void rejectRegistration(Integer restaurantId) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(restaurantId);
        if (optionalRestaurant.isPresent()) {
            Restaurant restaurant = optionalRestaurant.get();
            if (restaurant.getStatus() == Restaurant.RestaurantStatus.NEW_REG) {
                // Send rejection email before deleting
                if (restaurant.getEmailAddress() != null && !restaurant.getEmailAddress().isEmpty()) {
                    try {
                        String emailBody = String.format(
                            "Dear %s,\n\n" +
                            "We regret to inform you that your restaurant registration for %s has been rejected after careful review.\n\n" +
                            "If you believe this decision was made in error or would like more information about the reasons for rejection, " +
                            "please contact our support team at your earliest convenience.\n\n" +
                            "We appreciate your interest in FrontDash.\n\n" +
                            "Best regards,\n" +
                            "FrontDash Team",
                            restaurant.getContactPersonName(),
                            restaurant.getName()
                        );
                        emailService.sendEmail(
                            restaurant.getEmailAddress(),
                            emailBody,
                            com.frontdash.dao.MessageType.RESTAURANT_APPROVAL_REJECTION
                        );
                        System.out.println("[Email] Rejection notification sent to: " + restaurant.getEmailAddress());
                    } catch (Exception e) {
                        System.err.println("[Email] Failed to send rejection email: " + e.getMessage());
                        e.printStackTrace();
                    }
                }

                // For rejection, delete the restaurant as it's a rejected registration
                deleteRestaurantRelatedRecords(restaurantId);
                restaurantRepository.delete(restaurant);
            } else {
                throw new IllegalArgumentException("Restaurant is not in NEW_REG status");
            }
        } else {
            throw new IllegalArgumentException("Restaurant not found");
        }
    }

    /**
     * Approve a restaurant withdrawal
     * @param restaurantId the ID of the restaurant to approve withdrawal for
     * @throws IllegalArgumentException if restaurant not found or not in WITHDRAW_REQ status
     */
    public void approveWithdrawal(Integer restaurantId) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(restaurantId);
        if (optionalRestaurant.isPresent()) {
            Restaurant restaurant = optionalRestaurant.get();
            if (restaurant.getStatus() == Restaurant.RestaurantStatus.WITHDRAW_REQ) {
                // Send withdrawal approval email before deleting
                if (restaurant.getEmailAddress() != null && !restaurant.getEmailAddress().isEmpty()) {
                    try {
                        String emailBody = String.format(
                            "Dear %s,\n\n" +
                            "Your withdrawal request for %s has been approved.\n\n" +
                            "Your restaurant has been removed from the FrontDash platform. " +
                            "All associated data and credentials have been deactivated.\n\n" +
                            "Thank you for being a part of FrontDash. We wish you all the best in your future endeavors.\n\n" +
                            "If you have any questions, please contact our support team.\n\n" +
                            "Best regards,\n" +
                            "FrontDash Team",
                            restaurant.getContactPersonName(),
                            restaurant.getName()
                        );
                        emailService.sendEmail(
                            restaurant.getEmailAddress(),
                            emailBody,
                            com.frontdash.dao.MessageType.RESTAURANT_WITHDRAWAL_APPROVAL
                        );
                        System.out.println("[Email] Withdrawal approval notification sent to: " + restaurant.getEmailAddress());
                    } catch (Exception e) {
                        System.err.println("[Email] Failed to send withdrawal approval email: " + e.getMessage());
                        e.printStackTrace();
                    }
                }

                // For approved withdrawal, delete the restaurant
                deleteRestaurantRelatedRecords(restaurantId);
                restaurantRepository.delete(restaurant);
            } else {
                throw new IllegalArgumentException("Restaurant is not in WITHDRAW_REQ status");
            }
        } else {
            throw new IllegalArgumentException("Restaurant not found");
        }
    }

    /**
     * Reject a restaurant withdrawal
     * @param restaurantId the ID of the restaurant to reject withdrawal for
     * @return RestaurantResponse with updated status
     * @throws IllegalArgumentException if restaurant not found or not in WITHDRAW_REQ status
     */
    public RestaurantResponse rejectWithdrawal(Integer restaurantId) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(restaurantId);
        if (optionalRestaurant.isPresent()) {
            Restaurant restaurant = optionalRestaurant.get();
            if (restaurant.getStatus() == Restaurant.RestaurantStatus.WITHDRAW_REQ) {
                // For rejected withdrawal, set status back to ACTIVE
                restaurant.setStatus(Restaurant.RestaurantStatus.ACTIVE);
                Restaurant updatedRestaurant = restaurantRepository.save(restaurant);

                // Send withdrawal rejection email
                if (restaurant.getEmailAddress() != null && !restaurant.getEmailAddress().isEmpty()) {
                    try {
                        String emailBody = String.format(
                            "Dear %s,\n\n" +
                            "Your withdrawal request for %s has been reviewed and rejected.\n\n" +
                            "Your restaurant remains active on the FrontDash platform. " +
                            "You can continue to manage your restaurant operations as usual.\n\n" +
                            "If you have any questions or concerns about this decision, " +
                            "please contact our support team.\n\n" +
                            "Best regards,\n" +
                            "FrontDash Team",
                            restaurant.getContactPersonName(),
                            restaurant.getName()
                        );
                        emailService.sendEmail(
                            restaurant.getEmailAddress(),
                            emailBody,
                            com.frontdash.dao.MessageType.RESTAURANT_WITHDRAWAL_REJECTION
                        );
                        System.out.println("[Email] Withdrawal rejection notification sent to: " + restaurant.getEmailAddress());
                    } catch (Exception e) {
                        System.err.println("[Email] Failed to send withdrawal rejection email: " + e.getMessage());
                        e.printStackTrace();
                    }
                }

                return convertToResponse(updatedRestaurant);
            } else {
                throw new IllegalArgumentException("Restaurant is not in WITHDRAW_REQ status");
            }
        } else {
            throw new IllegalArgumentException("Restaurant not found");
        }
    }

    /**
     * Get all pending restaurant registrations
     * @return List of RestaurantResponse with NEW_REG status
     */
    public List<RestaurantResponse> getPendingRegistrations() {
        List<Restaurant> pendingRegistrations = restaurantRepository.findByStatus(Restaurant.RestaurantStatus.NEW_REG);
        return pendingRegistrations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all restaurant withdrawal requests
     * @return List of RestaurantResponse with WITHDRAW_REQ status
     */
    public List<RestaurantResponse> getWithdrawalRequests() {
        List<Restaurant> withdrawalRequests = restaurantRepository.findByStatus(Restaurant.RestaurantStatus.WITHDRAW_REQ);
        return withdrawalRequests.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }



    /**
     * Update admin password
     * @param username the admin username
     * @param newPassword the new password
     * @throws IllegalArgumentException if admin not found
     */
    @Transactional
    public void updateAdminPassword(String username, String newPassword) {
        EmployeeLogin admin = employeeLoginRepository.findByUsername(username)
                .filter(login -> login.getEmployeeType() == EmployeeLogin.EmployeeType.ADMIN)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        admin.setPassword(passwordEncoder.encode(newPassword));
        employeeLoginRepository.save(admin);
    }

    /**
     * Get service charge percentage
     * @return the current service charge percentage
     */
    public ServiceCharge getServiceCharge() {
        List<ServiceCharge> serviceCharges = serviceChargeRepository.findAll();
        if (serviceCharges.isEmpty()) {
            // Create default service charge if none exists
            ServiceCharge defaultCharge = ServiceCharge.builder()
                    .percentage(new java.math.BigDecimal("8.25"))
                    .build();
            return serviceChargeRepository.save(defaultCharge);
        }
        return serviceCharges.get(0); // Return the first one
    }

    /**
     * Update service charge percentage
     * @param percentage the new percentage
     * @return the updated ServiceCharge
     */
    @Transactional
    public ServiceCharge updateServiceCharge(java.math.BigDecimal percentage) {
        ServiceCharge serviceCharge = getServiceCharge();
        serviceCharge.setPercentage(percentage);
        return serviceChargeRepository.save(serviceCharge);
    }
}
