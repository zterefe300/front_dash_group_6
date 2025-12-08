package com.frontdash.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * Request model for creating a new menu category
 * Maps to frontend MenuManagement Add Category Dialog
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuCategoryCreateRequest {

    @NotBlank(message = "Category name is required")
    private String categoryName;

    private Integer restaurantId;
}
