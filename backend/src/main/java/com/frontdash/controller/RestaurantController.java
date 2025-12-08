package com.frontdash.controller;

import com.frontdash.dao.request.MenuUpdateRequest;
import com.frontdash.dao.request.OperatingHoursUpdateRequest;
import com.frontdash.dao.request.RestaurantRegistrationRequest;
import com.frontdash.dao.request.RestaurantWithdrawalRequest;
import com.frontdash.dao.request.RestaurantProfileUpdateRequest;
import com.frontdash.dao.request.RestaurantContactUpdateRequest;
import com.frontdash.dao.request.RestaurantAddressUpdateRequest;
import com.frontdash.dao.response.MenuItemResponse;
import com.frontdash.dao.response.OperatingHourResponse;
import com.frontdash.dao.response.RestaurantProfileResponse;
import com.frontdash.dao.response.RestaurantResponse;
import com.frontdash.service.RestaurantService;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant")
@Tag(name = "Restaurant Management", description = "APIs for restaurant registration, menu, operating hours, and withdrawal requests")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/registration")
    @Operation(summary = "Submit restaurant registration", description = "Create a new restaurant registration request for approval")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Registration request created",
                    content = @Content(schema = @Schema(implementation = RestaurantResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid registration data")
    })
    public ResponseEntity<RestaurantResponse> registerRestaurant(@RequestBody RestaurantRegistrationRequest request) {
        try {
            System.out.println(request.toString());
            return null;
//            RestaurantResponse response = restaurantService.registerRestaurant(request);
//            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/menu")
    @Operation(summary = "Update menu item", description = "Update an existing menu item for the specified restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu item updated",
                    content = @Content(schema = @Schema(implementation = MenuItemResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid menu item data"),
            @ApiResponse(responseCode = "404", description = "Menu item not found for restaurant")
    })
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable("id") Integer restaurantId,
            @RequestBody MenuUpdateRequest request) {
        try {
            MenuItemResponse response = restaurantService.updateMenuItem(restaurantId, request);
            return ResponseEntity.ok(response);
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
}
