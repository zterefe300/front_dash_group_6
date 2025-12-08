package com.frontdash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frontdash.dao.request.LoginRequest;
import com.frontdash.dao.response.LoginResponse;
import com.frontdash.entity.EmployeeLogin;
import com.frontdash.entity.Restaurant;
import com.frontdash.entity.RestaurantLogin;
import com.frontdash.repository.EmployeeLoginRepository;
import com.frontdash.repository.RestaurantLoginRepository;
import com.frontdash.repository.RestaurantRepository;

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

    @Transactional
    public void updatePassword(String username, String newPassword) {
        EmployeeLogin login = employeeLoginRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        login.setPassword(passwordEncoder.encode(newPassword));
        employeeLoginRepository.save(login);
    }

    public LoginResponse loginEmployee(LoginRequest request) {
        System.out.println(request.getUsername());
        EmployeeLogin login = employeeLoginRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), login.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String role = login.getEmployeeType().name(); // ADMIN or STAFF
        String message = login.getEmployeeType() == EmployeeLogin.EmployeeType.ADMIN ?
            "Admin login successful" : "Staff login successful";

        return LoginResponse.builder()
                .success(true)
                .message(message)
                .role(role)
                .build();
    }

    public LoginResponse loginOwner(LoginRequest request) {
        RestaurantLogin restaurantLogin = restaurantLoginRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), restaurantLogin.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantLogin.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Associated restaurant not found"));

        if (restaurant.getStatus() != Restaurant.RestaurantStatus.ACTIVE) {
            throw new IllegalArgumentException("Restaurant is not active");
        }

        return LoginResponse.builder()
                .success(true)
                .message("Restaurant owner login successful")
                .role("OWNER")
                .restaurantId(restaurant.getRestaurantId())
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        try {
            // First try employee login
            return loginEmployee(request);
        } catch (IllegalArgumentException e) {
            // If employee login fails, try owner login
            return loginOwner(request);
        }
    }
}
