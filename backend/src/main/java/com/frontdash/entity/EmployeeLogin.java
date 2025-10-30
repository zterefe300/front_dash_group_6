package com.frontdash.entity;

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

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "employeeType", nullable = false)
    private EmployeeType employeeType;

    @Column(name = "dateCreated")
    @Builder.Default
    private LocalDateTime dateCreated = LocalDateTime.now();

    public enum EmployeeType {
        ADMIN,
        STAFF
    }
}
