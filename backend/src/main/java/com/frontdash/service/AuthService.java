package com.frontdash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frontdash.dao.request.LoginRequest;
import com.frontdash.dao.response.EmployeeLoginResponse;
import com.frontdash.dao.response.RestaurantLoginResponse;
import com.frontdash.entity.EmployeeLogin;
import com.frontdash.entity.Restaurant;
import com.frontdash.entity.RestaurantLogin;
import com.frontdash.repository.EmployeeLoginRepository;
import com.frontdash.repository.RestaurantLoginRepository;
import com.frontdash.repository.RestaurantRepository;
import com.frontdash.util.JwtUtil;

@Service
@Transactional(readOnly = true)
public class AuthService {

    @Autowired
    private EmployeeLoginRepository employeeLoginRepository;

    @Autowired
    private RestaurantLoginRepository restaurantLoginRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public void updatePassword(String username, String newPassword) {
        EmployeeLogin login = employeeLoginRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        login.setPassword(passwordEncoder.encode(newPassword));
        employeeLoginRepository.save(login);
    }

    @Transactional
    public void updateRestaurantPassword(String username, String currentPassword, String newPassword) {
        RestaurantLogin restaurantLogin = restaurantLoginRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Verify current password
        if (!currentPassword.equals(restaurantLogin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Validate new password strength
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        // Update password (Note: Should be encoded in production)
        restaurantLogin.setPassword(newPassword);
        restaurantLoginRepository.save(restaurantLogin);
    }

    @Transactional
    public EmployeeLoginResponse loginEmployee(LoginRequest request) {
        System.out.println(request.getUsername());
        EmployeeLogin login = employeeLoginRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), login.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String role = login.getEmployeeType().name(); // ADMIN or STAFF
        String message = login.getEmployeeType() == EmployeeLogin.EmployeeType.ADMIN ?
            "Admin login successful" : "Staff login successful";

        // Check if staff user needs to change password on first login
        boolean forcePasswordChange = login.getEmployeeType() == EmployeeLogin.EmployeeType.STAFF
            && login.getLastLogin() == null;

        // Update last login timestamp
        login.setLastLogin(java.time.LocalDateTime.now());
        employeeLoginRepository.save(login);

        return EmployeeLoginResponse.builder()
                .success(true)
                .message(message)
                .role(role)
                .forcePasswordChange(forcePasswordChange)
                .build();
    }

    public RestaurantLoginResponse loginOwner(String username, String password) {
        RestaurantLogin restaurantLogin = restaurantLoginRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(password, restaurantLogin.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantLogin.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Associated restaurant not found"));

        if (restaurant.getStatus() != Restaurant.RestaurantStatus.ACTIVE) {
            throw new IllegalArgumentException("Restaurant is not active");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(username, restaurant.getRestaurantId(), "OWNER");

        return RestaurantLoginResponse.builder()
                .success(true)
                .message("Restaurant owner login successful")
                .role("OWNER")
                .restaurantId(restaurant.getRestaurantId())
                .token(token)
                .username(username)
                .restaurantName(restaurant.getName())
                .email(restaurant.getEmailAddress())
                .status(restaurant.getStatus().name())
                .build();
    }
}
