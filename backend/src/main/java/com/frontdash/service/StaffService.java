package com.frontdash.service;

import com.frontdash.dao.request.StaffRequest;
import com.frontdash.dao.response.StaffResponse;
import com.frontdash.entity.EmployeeLogin;
import com.frontdash.entity.StaffUsers;
import com.frontdash.repository.EmployeeLoginRepository;
import com.frontdash.repository.StaffUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StaffService {

    @Autowired
    private EmployeeLoginRepository employeeLoginRepository;

    @Autowired
    private StaffUsersRepository staffUsersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Helper method to convert StaffUsers entity to StaffResponse DTO
    private StaffResponse convertToResponse(StaffUsers staff) {
        return new StaffResponse(staff.getUsername(), staff.getFirstname(), staff.getLastname());
    }

    // Helper method to convert StaffRequest DTO to EmployeeLogin entity
    private EmployeeLogin convertRequestToEmployeeLogin(StaffRequest staffRequest) {
        return EmployeeLogin.builder()
                .username(staffRequest.getUsername())
                .password(passwordEncoder.encode(staffRequest.getPassword()))
                .employeeType(EmployeeLogin.EmployeeType.STAFF)
                .build();
    }

    // Helper method to convert StaffRequest DTO to StaffUsers entity
    private StaffUsers convertRequestToStaffUsers(StaffRequest staffRequest) {
        return new StaffUsers(staffRequest.getUsername(), staffRequest.getFirstname(), staffRequest.getLastname());
    }

    /**
     * Create a new staff account
     * @param staffRequest the staff data to create
     * @return StaffResponse with created staff data
     * @throws IllegalArgumentException if username already exists
     */
    public StaffResponse createStaff(StaffRequest staffRequest) {
        // Check if username already exists in EmployeeLogin table
        if (employeeLoginRepository.existsByUsername(staffRequest.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Create the employee login first
        EmployeeLogin employeeLogin = convertRequestToEmployeeLogin(staffRequest);
        employeeLoginRepository.save(employeeLogin);

        // Create the staff user
        StaffUsers staff = convertRequestToStaffUsers(staffRequest);
        StaffUsers savedStaff = staffUsersRepository.save(staff);
        return convertToResponse(savedStaff);
    }

    /**
     * Delete a staff account by username
     * @param username the username of the staff to delete
     * @throws IllegalArgumentException if staff not found
     */
    public void deleteStaff(String username) {
        // Check if employee login exists
        Optional<EmployeeLogin> employeeLogin = employeeLoginRepository.findById(username);
        if (!employeeLogin.isPresent()) {
            throw new IllegalArgumentException("Employee login not found");
        }

        // Check if staff user exists
        Optional<StaffUsers> staff = staffUsersRepository.findById(username);
        if (!staff.isPresent()) {
            throw new IllegalArgumentException("Staff account not found");
        }

        // Delete the staff user first (due to foreign key constraint)
        staffUsersRepository.delete(staff.get());

        // Then delete the employee login
        employeeLoginRepository.delete(employeeLogin.get());
    }

    /**
     * Get all staff accounts
     * @return List of StaffResponse
     */
    public List<StaffResponse> getAllStaff() {
        List<StaffUsers> staffList = staffUsersRepository.findAll();
        System.out.println("Total staff accounts found: " + staffList.size());
        return staffList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a staff account by username
     * @param username the username to search for
     * @return StaffResponse if found
     * @throws IllegalArgumentException if staff not found
     */
    public StaffResponse getStaffByUsername(String username) {
        Optional<StaffUsers> staff = staffUsersRepository.findById(username);
        return staff.map(this::convertToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Staff account not found"));
    }

    /**
     * Search staff accounts by name (firstname or lastname)
     * @param name the name to search for
     * @return List of StaffResponse matching the search
     */
    public List<StaffResponse> searchStaffByName(String name) {
        List<StaffUsers> staffByFirstname = staffUsersRepository.findByFirstnameContainingIgnoreCase(name);
        List<StaffUsers> staffByLastname = staffUsersRepository.findByLastnameContainingIgnoreCase(name);

        // Combine results and remove duplicates
        staffByFirstname.addAll(staffByLastname);
        List<StaffUsers> uniqueStaff = staffByFirstname.stream()
                .distinct()
                .toList();

        return uniqueStaff.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update an existing staff account
     * @param username the username of the staff to update
     * @param staffRequest the updated staff data
     * @return StaffResponse with updated data
     * @throws IllegalArgumentException if staff not found
     */
    public StaffResponse updateStaff(String username, StaffRequest staffRequest) {
        Optional<StaffUsers> optionalStaff = staffUsersRepository.findById(username);
        if (optionalStaff.isPresent()) {
            StaffUsers staff = optionalStaff.get();
            staff.setFirstname(staffRequest.getFirstname());
            staff.setLastname(staffRequest.getLastname());
            StaffUsers updatedStaff = staffUsersRepository.save(staff);
            return convertToResponse(updatedStaff);
        } else {
            throw new IllegalArgumentException("Staff account not found");
        }
    }
}
