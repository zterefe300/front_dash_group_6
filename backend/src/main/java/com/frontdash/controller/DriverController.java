package com.frontdash.controller;

import com.frontdash.dao.request.DriverRequest;
import com.frontdash.dao.response.DriverResponse;
import com.frontdash.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@Tag(name = "Driver Management", description = "APIs for managing drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping
    @Operation(summary = "Add a new driver", description = "Add a new driver with the provided information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Driver successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid driver data")
    })
    public ResponseEntity<DriverResponse> addDriver(@RequestBody DriverRequest driverRequest) {
        try {
            DriverResponse response = driverService.createDriver(driverRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete driver", description = "Delete a driver by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Driver successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Driver not found")
    })
    public ResponseEntity<Void> deleteDriver(
            @Parameter(description = "ID of the driver to delete")
            @PathVariable Integer id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
