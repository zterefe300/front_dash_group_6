package com.frontdash.controller;

import com.frontdash.dao.request.MenuCategoryCreateRequest;
import com.frontdash.dao.request.MenuItemCreateRequest;
import com.frontdash.dao.request.MenuItemUpdateRequest;
import com.frontdash.dao.response.MenuItemResponse;
import com.frontdash.entity.MenuCategory;
import com.frontdash.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurant/{restaurantId}/menu")
@CrossOrigin(origins = "*")
@Tag(name = "Menu Management", description = "APIs for restaurant menu items and categories")
public class MenuController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    @Operation(summary = "List menu items for restaurant")
    public ResponseEntity<List<MenuItemResponse>> getMenu(@PathVariable Integer restaurantId) {
        return ResponseEntity.ok(restaurantService.getMenuItems(restaurantId));
    }

    @PostMapping
    @Operation(summary = "Create menu item")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Menu item created"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<MenuItemResponse> createMenuItem(
            @PathVariable Integer restaurantId,
            @RequestBody MenuItemCreateRequest request
    ) {
        return ResponseEntity.ok(restaurantService.createMenuItem(restaurantId, request));
    }

    @PutMapping("/{menuItemId}")
    @Operation(summary = "Update menu item")
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable Integer restaurantId,
            @PathVariable Integer menuItemId,
            @RequestBody MenuItemUpdateRequest request
    ) {
        return ResponseEntity.ok(restaurantService.updateMenuItem(restaurantId, menuItemId, request));
    }

    @DeleteMapping("/{menuItemId}")
    @Operation(summary = "Delete menu item")
    public ResponseEntity<Void> deleteMenuItem(
            @PathVariable Integer restaurantId,
            @PathVariable Integer menuItemId
    ) {
        restaurantService.deleteMenuItem(restaurantId, menuItemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{menuItemId}/availability")
    @Operation(summary = "Toggle menu item availability")
    public ResponseEntity<Void> updateAvailability(
            @PathVariable Integer restaurantId,
            @PathVariable Integer menuItemId,
            @RequestBody Map<String, Boolean> payload
    ) {
        boolean isAvailable = Boolean.TRUE.equals(payload.get("isAvailable"));
        restaurantService.updateMenuItemAvailability(restaurantId, menuItemId, isAvailable);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories")
    @Operation(summary = "List menu categories for restaurant")
    public ResponseEntity<List<MenuCategory>> getCategories(@PathVariable Integer restaurantId) {
        return ResponseEntity.ok(restaurantService.getCategories(restaurantId));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create menu category")
    public ResponseEntity<MenuCategory> createCategory(
            @PathVariable Integer restaurantId,
            @RequestBody MenuCategoryCreateRequest request
    ) {
        return ResponseEntity.ok(restaurantService.createCategory(restaurantId, request));
    }
}
