package com.frontdash.controller;

import com.frontdash.dao.request.MenuUpdateRequest;
import com.frontdash.dao.request.OperatingHoursUpdateRequest;
import com.frontdash.dao.request.RestaurantRegistrationRequest;
import com.frontdash.dao.request.RestaurantWithdrawalRequest;
import com.frontdash.dao.request.RestaurantProfileUpdateRequest;
import com.frontdash.dao.request.RestaurantContactUpdateRequest;
import com.frontdash.dao.request.RestaurantAddressUpdateRequest;
import com.frontdash.dao.response.*;
import com.frontdash.service.RestaurantService;
import com.frontdash.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant")
@Tag(name = "Restaurant Management", description = "APIs for restaurant registration, menu, operating hours, and withdrawal requests")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "Get all restaurants", description = "Retrieve a list of all restaurants")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved restaurants")
    })
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        List<RestaurantResponse> responseList = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/with-address")
    @Operation(summary = "Get all restaurants with addresses", description = "Retrieve a list of all restaurants including their full address information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved restaurants with addresses")
    })
    public ResponseEntity<List<RestaurantWithAddressResponse>> getAllRestaurantsWithAddress() {
        List<RestaurantWithAddressResponse> responseList = restaurantService.getAllRestaurantsWithAddress();
        return ResponseEntity.ok(responseList);
    }

    @PostMapping("/registration")
    @Operation(summary = "Submit restaurant registration", description = "Create a new restaurant registration request for approval")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Registration request created",
                    content = @Content(schema = @Schema(implementation = RestaurantResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid registration data")
    })
    public ResponseEntity<RestaurantRegistrationResponse> registerRestaurant(@RequestBody RestaurantRegistrationRequest request) {
        try {
            RestaurantRegistrationResponse response = restaurantService.registerRestaurant(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/hours")
    @Operation(summary = "Update operating hours", description = "Modify operating hours for the specified restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Operating hours updated",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = OperatingHourResponse.class)))),
            @ApiResponse(responseCode = "400", description = "Invalid operating hours data")
    })
    public ResponseEntity<List<OperatingHourResponse>> updateOperatingHours(
            @PathVariable("id") Integer restaurantId,
            @RequestBody OperatingHoursUpdateRequest request) {
        try {
            System.out.println(request);
            List<OperatingHourResponse> responses = restaurantService.updateOperatingHours(restaurantId, request);
            return ResponseEntity.ok(responses);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<RestaurantProfileResponse> getProfile(@PathVariable("id") Integer restaurantId) {
        try {
            return ResponseEntity.ok(restaurantService.getRestaurantProfile(restaurantId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<RestaurantProfileResponse> updateProfile(
            @PathVariable("id") Integer restaurantId,
            @RequestBody RestaurantProfileUpdateRequest request) {
        try {
            return ResponseEntity.ok(restaurantService.updateRestaurantProfile(restaurantId, request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/contact")
    public ResponseEntity<RestaurantProfileResponse> updateContact(
            @PathVariable("id") Integer restaurantId,
            @RequestBody RestaurantContactUpdateRequest request) {
        try {
            return ResponseEntity.ok(restaurantService.updateContact(restaurantId, request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/address")
    public ResponseEntity<RestaurantProfileResponse> updateAddress(
            @PathVariable("id") Integer restaurantId,
            @RequestBody RestaurantAddressUpdateRequest request) {
        try {
            return ResponseEntity.ok(restaurantService.updateAddress(restaurantId, request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/hours")
    public ResponseEntity<List<OperatingHourResponse>> getOperatingHours(@PathVariable("id") Integer restaurantId) {
        try {
            return ResponseEntity.ok(restaurantService.getOperatingHours(restaurantId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/withdrawal")
    @Operation(summary = "Request restaurant withdrawal", description = "Submit a withdrawal request for an active restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Withdrawal request submitted",
                    content = @Content(schema = @Schema(implementation = RestaurantResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid withdrawal request")
    })
    public ResponseEntity<RestaurantResponse> requestWithdrawal(@RequestBody RestaurantWithdrawalRequest request) {
        try {
            RestaurantResponse response = restaurantService.requestWithdrawal(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change restaurant owner password", description = "Update the password for the restaurant owner account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid password change request")
    })
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody com.frontdash.dao.request.PasswordUpdateRequest request) {
        try {
            // Extract username from JWT token
            String token = authHeader.replace("Bearer ", "");
            // TODO: Extract username from token using JwtUtil
            // For now, use username from request
            restaurantService.changeRestaurantPassword(request.getUsername(), request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
