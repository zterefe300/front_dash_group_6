package com.frontdash.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "MenuItem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_item_id")
    private Integer menuItemId;

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability", nullable = false)
    @Builder.Default
    private AvailabilityStatus availability = AvailabilityStatus.AVAILABLE;

    public enum AvailabilityStatus {
        AVAILABLE, UNAVAILABLE
    }
}
