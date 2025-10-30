package com.frontdash.repository;

import com.frontdash.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {

    // Find driver by ID (this is the primary key)
    Optional<Driver> findByDriverId(Integer driverId);

    // Find drivers by firstname
    List<Driver> findByFirstname(String firstname);

    // Find drivers by lastname
    List<Driver> findByLastname(String lastname);

    // Find drivers by firstname and lastname
    List<Driver> findByFirstnameAndLastname(String firstname, String lastname);

    // Find drivers by availability status
    List<Driver> findByAvailabilityStatus(Driver.AvailabilityStatus availabilityStatus);

    // Check if driver ID exists
    boolean existsByDriverId(Integer driverId);

    // Find drivers by firstname containing (case-insensitive search)
    List<Driver> findByFirstnameContainingIgnoreCase(String firstname);

    // Find drivers by lastname containing (case-insensitive search)
    List<Driver> findByLastnameContainingIgnoreCase(String lastname);
}
