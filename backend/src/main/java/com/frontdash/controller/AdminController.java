package com.frontdash.controller;

import com.frontdash.dao.response.RestaurantResponse;
import com.frontdash.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management", description = "APIs for administrative operations")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PutMapping("/registrations/{id}/approve")
    @Operation(summary = "Approve restaurant registration", description = "Approve a restaurant registration request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successfully approved"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @ApiResponse(responseCode = "400", description = "Restaurant is not in NEW_REG status")
    })
    public ResponseEntity<RestaurantResponse> approveRegistration(
            @Parameter(description = "ID of the restaurant to approve")
            @PathVariable Integer id) {
        try {
            RestaurantResponse response = adminService.approveRegistration(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/registrations/{id}/reject")
    @Operation(summary = "Reject restaurant registration", description = "Reject a restaurant registration request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successfully rejected"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @ApiResponse(responseCode = "400", description = "Restaurant is not in NEW_REG status")
    })
    public ResponseEntity<Void> rejectRegistration(
            @Parameter(description = "ID of the restaurant to reject")
            @PathVariable Integer id) {
        try {
            adminService.rejectRegistration(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/withdrawals/{id}/approve")
    @Operation(summary = "Approve restaurant withdrawal", description = "Approve a restaurant withdrawal request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Withdrawal successfully approved"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @ApiResponse(responseCode = "400", description = "Restaurant is not in WITHDRAW_REQ status")
    })
    public ResponseEntity<Void> approveWithdrawal(
            @Parameter(description = "ID of the restaurant to approve withdrawal for")
            @PathVariable Integer id) {
        try {
            adminService.approveWithdrawal(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/withdrawals/{id}/reject")
    @Operation(summary = "Reject restaurant withdrawal", description = "Reject a restaurant withdrawal request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Withdrawal successfully rejected"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @ApiResponse(responseCode = "400", description = "Restaurant is not in WITHDRAW_REQ status")
    })
    public ResponseEntity<RestaurantResponse> rejectWithdrawal(
            @Parameter(description = "ID of the restaurant to reject withdrawal for")
            @PathVariable Integer id) {
        try {
            RestaurantResponse response = adminService.rejectWithdrawal(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/registrations")
    @Operation(summary = "Get pending registrations", description = "Retrieve all restaurants with NEW_REG status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved pending registrations")
    })
    public ResponseEntity<List<RestaurantResponse>> getPendingRegistrations() {
        List<RestaurantResponse> responseList = adminService.getPendingRegistrations();
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/withdrawals")
    @Operation(summary = "Get withdrawal requests", description = "Retrieve all restaurants with WITHDRAW_REQ status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved withdrawal requests")
    })
    public ResponseEntity<List<RestaurantResponse>> getWithdrawalRequests() {
        List<RestaurantResponse> responseList = adminService.getWithdrawalRequests();
        return ResponseEntity.ok(responseList);
    }
}
