package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

/**
 * Request model for creating a new menu item
 * Maps to frontend MenuManagement Add Dialog
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemCreateRequest {

    @NotBlank(message = "Item name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotBlank(message = "Category is required")
    private String category;

    @Builder.Default
    private Boolean isAvailable = true;

    private String imageUrl;
}
