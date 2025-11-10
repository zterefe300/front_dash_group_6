package com.frontdash.service;

import com.frontdash.dao.request.LoginRequest;
import com.frontdash.dao.response.LoginResponse;
import com.frontdash.entity.EmployeeLogin;
import com.frontdash.entity.Restaurant;
import com.frontdash.entity.RestaurantLogin;
import com.frontdash.repository.EmployeeLoginRepository;
import com.frontdash.repository.RestaurantLoginRepository;
import com.frontdash.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public LoginResponse loginStaff(LoginRequest request) {
        EmployeeLogin login = employeeLoginRepository.findByUsername(request.getUsername())
                .filter(employeeLogin -> employeeLogin.getEmployeeType() == EmployeeLogin.EmployeeType.STAFF)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));
        if (!request.getPassword().equals(login.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return LoginResponse.builder()
                .success(true)
                .message("Staff login successful")
                .role(EmployeeLogin.EmployeeType.STAFF.name())
                .build();
    }

    public LoginResponse loginOwner(LoginRequest request) {
        RestaurantLogin restaurantLogin = restaurantLoginRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!request.getPassword().equals(restaurantLogin.getPassword())) {
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
}
