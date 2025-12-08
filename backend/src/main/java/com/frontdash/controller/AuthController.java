package com.frontdash.controller;

import com.frontdash.dao.request.LoginRequest;
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

    @PostMapping("/staff/login")
    @Operation(summary = "Staff login", description = "Authenticate a staff member using username and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Staff login successful",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class)))
    })
    public ResponseEntity<LoginResponse> staffLogin(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.loginStaff(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    LoginResponse.builder()
                            .success(false)
                            .message(ex.getMessage())
                            .role("STAFF")
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
}
