package com.frontdash.service;

import com.frontdash.dao.request.DriverRequest;
import com.frontdash.dao.response.DriverResponse;
import com.frontdash.entity.Driver;
import com.frontdash.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    // Helper method to convert Driver entity to DriverResponse DTO
    private DriverResponse convertToResponse(Driver driver) {
        return new DriverResponse(driver.getDriverId(), driver.getFirstname(), driver.getLastname(), driver.getAvailabilityStatus());
    }

    // Helper method to convert DriverRequest DTO to Driver entity
    private Driver convertRequestToDriver(DriverRequest driverRequest) {
        return Driver.builder()
                .firstname(driverRequest.getFirstname())
                .lastname(driverRequest.getLastname())
                .availabilityStatus(driverRequest.getAvailabilityStatus() != null ? driverRequest.getAvailabilityStatus() : Driver.AvailabilityStatus.AVAILABLE)
                .build();
    }

    /**
     * Create a new driver
     * @param driverRequest the driver data to create
     * @return DriverResponse with created driver data
     */
    public DriverResponse createDriver(DriverRequest driverRequest) {
        Driver driver = convertRequestToDriver(driverRequest);
        Driver savedDriver = driverRepository.save(driver);
        return convertToResponse(savedDriver);
    }

    /**
     * Delete a driver by ID
     * @param driverId the ID of the driver to delete
     * @throws IllegalArgumentException if driver not found
     */
    public void deleteDriver(Integer driverId) {
        Optional<Driver> driver = driverRepository.findById(driverId);
        if (!driver.isPresent()) {
            throw new IllegalArgumentException("Driver not found");
        }
        driverRepository.delete(driver.get());
    }

    /**
     * Get all drivers
     * @return List of DriverResponse
     */
    public List<DriverResponse> getAllDrivers() {
        List<Driver> driverList = driverRepository.findAll();
        return driverList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a driver by ID
     * @param driverId the ID to search for
     * @return DriverResponse if found
     * @throws IllegalArgumentException if driver not found
     */
    public DriverResponse getDriverById(Integer driverId) {
        Optional<Driver> driver = driverRepository.findById(driverId);
        return driver.map(this::convertToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }
}
