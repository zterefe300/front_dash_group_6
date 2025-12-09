package com.frontdash.controller;

import com.frontdash.dao.request.PasswordUpdateRequest;
import com.frontdash.dao.response.RestaurantResponse;
import com.frontdash.entity.EmployeeLogin;
import com.frontdash.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/profile")
    @Operation(summary = "Get admin profile", description = "Retrieve the current admin's profile information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved admin profile"),
            @ApiResponse(responseCode = "404", description = "Admin not found")
    })
    public ResponseEntity<EmployeeLogin> getAdminProfile(@RequestParam String username) {
        try {
            EmployeeLogin profile = adminService.getAdminProfile(username);
            // Don't return password in response
            profile.setPassword(null);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/password")
    @Operation(summary = "Update admin password", description = "Update the password for the specified admin")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<Void> updateAdminPassword(@RequestBody PasswordUpdateRequest request) {
        try {
            adminService.updateAdminPassword(request.getUsername(), request.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/service-charge")
    @Operation(summary = "Get service charge percentage", description = "Retrieve the current service charge percentage")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved service charge")
    })
    public ResponseEntity<com.frontdash.entity.ServiceCharge> getServiceCharge() {
        com.frontdash.entity.ServiceCharge serviceCharge = adminService.getServiceCharge();
        return ResponseEntity.ok(serviceCharge);
    }

    @PutMapping("/service-charge")
    @Operation(summary = "Update service charge percentage", description = "Update the service charge percentage")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Service charge updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<com.frontdash.entity.ServiceCharge> updateServiceCharge(@RequestBody java.math.BigDecimal percentage) {
        try {
            com.frontdash.entity.ServiceCharge updatedCharge = adminService.updateServiceCharge(percentage);
            return ResponseEntity.ok(updatedCharge);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
