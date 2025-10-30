package com.frontdash.repository;

import com.frontdash.entity.StaffUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffUsersRepository extends JpaRepository<StaffUsers, String> {

    // Find staff user by username (this is the primary key)
    Optional<StaffUsers> findByUsername(String username);

    // Find staff users by firstname
    List<StaffUsers> findByFirstname(String firstname);

    // Find staff users by lastname
    List<StaffUsers> findByLastname(String lastname);

    // Find staff users by firstname and lastname
    List<StaffUsers> findByFirstnameAndLastname(String firstname, String lastname);

    // Check if username exists
    boolean existsByUsername(String username);

    // Find staff users by firstname containing (case-insensitive search)
    List<StaffUsers> findByFirstnameContainingIgnoreCase(String firstname);

    // Find staff users by lastname containing (case-insensitive search)
    List<StaffUsers> findByLastnameContainingIgnoreCase(String lastname);
}
