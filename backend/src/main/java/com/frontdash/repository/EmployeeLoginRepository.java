package com.frontdash.repository;

import com.frontdash.entity.EmployeeLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeLoginRepository extends JpaRepository<EmployeeLogin, String> {

    // Find employee login by username (this is the primary key)
    Optional<EmployeeLogin> findByUsername(String username);

    // Check if username exists
    boolean existsByUsername(String username);

    // Find employee logins by employee type
    List<EmployeeLogin> findByEmployeeType(EmployeeLogin.EmployeeType employeeType);
}
