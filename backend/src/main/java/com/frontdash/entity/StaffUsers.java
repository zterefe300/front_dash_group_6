package com.frontdash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "StaffUsers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffUsers {

    @Id
    @Column(name = "username")
    private String username;

    @Column(name = "firstname", nullable = false)
    private String firstname;

    @Column(name = "lastname", nullable = false)
    private String lastname;
}
