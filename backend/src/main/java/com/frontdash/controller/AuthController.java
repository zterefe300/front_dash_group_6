package com.frontdash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.frontdash.dao.request.LoginRequest;
import com.frontdash.dao.request.PasswordUpdateRequest;
import com.frontdash.dao.response.EmployeeLoginResponse;
import com.frontdash.dao.response.LoginResponse;
import com.frontdash.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "APIs for restaurant owner and staff login")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/employee/login")
    @Operation(summary = "Employee login", description = "Authenticate an employee (admin or staff) using username and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee login successful",
                    content = @Content(schema = @Schema(implementation = EmployeeLoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = EmployeeLoginResponse.class)))
    })
    public ResponseEntity<EmployeeLoginResponse> employeeLogin(@RequestBody LoginRequest request) {
        try {
            EmployeeLoginResponse response = authService.loginEmployee(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    EmployeeLoginResponse.builder()
                            .success(false)
                            .message(ex.getMessage())
                            .role(null)
                            .forcePasswordChange(false)
                            .build()
            );
        }
    }

    @PostMapping("/owner/login")
    @Operation(summary = "Restaurant owner login", description = "Authenticate a restaurant owner using username and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurant owner login successful",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials or restaurant not active",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class)))
    })
    public ResponseEntity<LoginResponse> ownerLogin(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.loginOwner(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    LoginResponse.builder()
                            .success(false)
                            .message(ex.getMessage())
                            .role("OWNER")
                            .build()
            );
        }
    }

    @PostMapping("/owner/logout")
    @Operation(summary = "Restaurant owner logout", description = "Logout restaurant owner and invalidate token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout successful"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<LoginResponse> ownerLogout(@RequestHeader(value = "Authorization", required = false) String token) {
        return ResponseEntity.ok(
                LoginResponse.builder()
                        .success(true)
                        .message("Logout successful")
                        .build()
        );
    }

    @PutMapping("/password")
    @Operation(summary = "Update password", description = "Update the password for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<Void> updatePassword(@RequestBody PasswordUpdateRequest request) {
        try {
            // Assuming username comes from authentication context
            // For now, hardcode or get from request
            authService.updatePassword(request.getUsername(), request.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
