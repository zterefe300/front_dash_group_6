package com.frontdash.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "EmployeeLogin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLogin {

    @Id
    @Column(name = "username")
    private String username;

    //We can't remove the password field since JPA requires one to 
    //one mapping between table and entity but we added JsonIgnore to make sure if someone in case returns EmployeeLogin 
    // response object the pwd will not be added 
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "employeeType", nullable = false)
    private EmployeeType employeeType;

    @Column(name = "dateCreated")
    @Builder.Default
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Column(name = "lastLogin")
    private LocalDateTime lastLogin;

    public enum EmployeeType {
        ADMIN,
        STAFF
    }
}
