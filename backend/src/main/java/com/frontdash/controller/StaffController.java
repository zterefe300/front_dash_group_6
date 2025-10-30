package com.frontdash.controller;

import com.frontdash.dao.request.StaffRequest;
import com.frontdash.dao.response.StaffResponse;
import com.frontdash.service.StaffService;
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
@RequestMapping("/api/staff")
@Tag(name = "Staff Management", description = "APIs for managing staff accounts")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping
    @Operation(summary = "Create a new staff account", description = "Create a new staff account with the provided information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Staff account successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid staff data or username already exists")
    })
    public ResponseEntity<StaffResponse> createStaff(@RequestBody StaffRequest staffRequest) {
        try {
            
            StaffResponse response = staffService.createStaff(staffRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete staff account", description = "Delete a staff account by their username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Staff account successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Staff account not found")
    })
    public ResponseEntity<Void> deleteStaff(
            @Parameter(description = "Username of the staff account to delete")
            @PathVariable String id) {
        try {
            staffService.deleteStaff(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @Operation(summary = "Get all staff accounts", description = "Retrieve a list of all staff accounts")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved staff accounts")
    })
    public ResponseEntity<List<StaffResponse>> getAllStaff() {
        List<StaffResponse> responseList = staffService.getAllStaff();
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get staff by username", description = "Retrieve a specific staff account by their username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved staff account"),
            @ApiResponse(responseCode = "404", description = "Staff account not found")
    })
    public ResponseEntity<StaffResponse> getStaffById(
            @Parameter(description = "Username of the staff account to retrieve")
            @PathVariable String id) {
        try {
            StaffResponse response = staffService.getStaffByUsername(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search staff by name", description = "Search staff accounts by firstname or lastname (case-insensitive)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved matching staff accounts")
    })
    public ResponseEntity<List<StaffResponse>> searchStaff(
            @Parameter(description = "Name to search for (searches both firstname and lastname)")
            @RequestParam String name) {
        List<StaffResponse> responseList = staffService.searchStaffByName(name);
        return ResponseEntity.ok(responseList);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update staff account", description = "Update an existing staff account's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Staff account successfully updated"),
            @ApiResponse(responseCode = "404", description = "Staff account not found"),
            @ApiResponse(responseCode = "400", description = "Invalid staff data")
    })
    public ResponseEntity<StaffResponse> updateStaff(
            @Parameter(description = "Username of the staff account to update")
            @PathVariable String id,
            @RequestBody StaffRequest staffRequest) {
        try {
            StaffResponse response = staffService.updateStaff(id, staffRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
