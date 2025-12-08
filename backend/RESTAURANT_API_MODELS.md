# Restaurant API Models Documentation

This document outlines all the API models generated for the restaurant management features, based on the frontend UI requirements.

## Overview

The API models have been designed to support the following restaurant features:
1. Restaurant Registration
2. Restaurant Login/Logout
3. Update Restaurant Profile (Basic Info, Contact, Address)
4. Menu Management (Create, Update, Delete items and categories)
5. Operating Hours Management
6. Change Password
7. Withdrawal Application

---

## 1. Restaurant Registration

### Request Model
**File:** `dao/request/RestaurantRegistrationRequest.java`

```java
{
  // Basic Restaurant Information
  "restaurantName": "string",
  "businessType": "string",
  "description": "string",

  // Contact Information
  "ownerName": "string",
  "email": "string",
  "phone": "string",

  // Business Address
  "building": "string",
  "street": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",

  // Menu Items
  "menuItems": [
    {
      "name": "string",
      "category": "string",
      "price": "double",
      "description": "string"
    }
  ],

  // Operating Hours
  "operatingHours": [
    {
      "day": "string",
      "isOpen": "boolean",
      "openTime": "string",
      "closeTime": "string"
    }
  ],

  // Supporting Documents
  "supportingFiles": ["string"],

  // Agreements
  "agreeToTerms": "boolean",
  "agreeToCommission": "boolean",
  "confirmAccuracy": "boolean"
}
```

### Response Model
**File:** `dao/response/RestaurantRegistrationResponse.java`

```java
{
  "id": "string",
  "status": "string",
  "message": "string",
  "submittedAt": "LocalDateTime",
  "generatedUsername": "string"
}
```

**Frontend Mapping:** `RegistrationPage.tsx`

---

## 2. Restaurant Login

### Request Model
**File:** `dao/request/RestaurantLoginRequest.java`

```java
{
  "username": "string",  // Format: lastname + 2 digits (e.g., "smith01")
  "password": "string"
}
```

**Validation:**
- Username: minimum 3 characters, must match pattern `^[a-zA-Z]+\\d{2}$`
- Password: required

### Response Model
**File:** `dao/response/RestaurantLoginResponse.java`

```java
{
  "token": "string",
  "username": "string",
  "restaurantId": "integer",
  "restaurantName": "string",
  "email": "string",
  "status": "string",
  "message": "string"
}
```

**Frontend Mapping:** `LoginPage.tsx`

---

## 3. Update Restaurant Profile

### 3.1 Basic Profile Update

**File:** `dao/request/RestaurantProfileUpdateRequest.java`

```java
{
  "name": "string",
  "description": "string",
  "businessType": "string"
}
```

**Frontend Mapping:** `settings/RestaurantProfile.tsx`

### 3.2 Contact Information Update

**File:** `dao/request/RestaurantContactUpdateRequest.java`

```java
{
  "contactName": "string",
  "phoneNumber": "string",
  "email": "string"
}
```

**Validation:**
- All fields are required
- Email must be valid format

**Frontend Mapping:** `settings/ContactDetails.tsx`

### 3.3 Address Update

**File:** `dao/request/RestaurantAddressUpdateRequest.java`

```java
{
  "building": "string",
  "street": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string"
}
```

**Validation:**
- All fields are required

**Frontend Mapping:** `settings/AddressLocation.tsx`

---

## 4. Menu Management

### 4.1 Create Menu Item

**File:** `dao/request/MenuItemCreateRequest.java`

```java
{
  "name": "string",
  "description": "string",
  "price": "BigDecimal",
  "category": "string",
  "isAvailable": "boolean",  // Default: true
  "imageUrl": "string"
}
```

**Validation:**
- Name: required
- Price: required, must be positive
- Category: required

### 4.2 Update Menu Item

**File:** `dao/request/MenuItemUpdateRequest.java`

```java
{
  "name": "string",
  "description": "string",
  "price": "BigDecimal",
  "category": "string",
  "isAvailable": "boolean",
  "imageUrl": "string"
}
```

**Validation:**
- Same as create

### 4.3 Create Menu Category

**File:** `dao/request/MenuCategoryCreateRequest.java`

```java
{
  "categoryName": "string",
  "restaurantId": "integer"
}
```

**Validation:**
- Category name: required

### 4.4 Menu Item Response

**File:** `dao/response/MenuItemResponse.java` (existing file updated)

```java
{
  "menuItemId": "integer",
  "categoryId": "integer",
  "itemName": "string",
  "pictureUrl": "string",
  "price": "BigDecimal",
  "availability": "string"
}
```

**Frontend Mapping:** `MenuManagement.tsx`

---

## 5. Operating Hours Management

### Request Model
**File:** `dao/request/OperatingHoursUpdateRequest.java` (existing file)

```java
{
  "hours": [
    {
      "day": "string",        // monday, tuesday, etc.
      "isOpen": "boolean",
      "openTime": "string",   // Format: HH:mm (e.g., "11:00")
      "closeTime": "string"   // Format: HH:mm (e.g., "22:00")
    }
  ]
}
```

### Response Model
**File:** `dao/response/OperatingHoursResponse.java`

```java
{
  "hours": [
    {
      "day": "string",
      "isOpen": "boolean",
      "openTime": "string",
      "closeTime": "string"
    }
  ]
}
```

**Frontend Mapping:** `settings/OperatingHours.tsx`

---

## 6. Change Password

### Request Model
**File:** `dao/request/ChangePasswordRequest.java`

```java
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Validation:**
- Current password: required
- New password: required, minimum 8 characters

### Response Model
**File:** `dao/response/ChangePasswordResponse.java`

```java
{
  "success": "boolean",
  "message": "string"
}
```

**Frontend Mapping:** `settings/AccountSecurity.tsx`

---

## 7. Withdrawal Application

### Request Model
**File:** `dao/request/RestaurantWithdrawalRequest.java`

```java
{
  "restaurantId": "integer",
  "reason": "string",     // e.g., "closing-business", "financial-concerns", etc.
  "details": "string"
}
```

**Validation:**
- Reason: required
- Details: required

### Response Model
**File:** `dao/response/RestaurantWithdrawalResponse.java`

```java
{
  "id": "string",
  "reason": "string",
  "details": "string",
  "status": "string",         // pending, processing, completed, cancelled
  "createdAt": "LocalDateTime",
  "message": "string"
}
```

**Frontend Mapping:** `BusinessActions.tsx`

---

## API Endpoints Suggestion

Based on the models, here are the suggested API endpoints:

### Authentication & Registration
- `POST /api/restaurant/register` - Register new restaurant
- `POST /api/restaurant/login` - Restaurant login
- `POST /api/restaurant/logout` - Restaurant logout

### Profile Management
- `GET /api/restaurant/profile` - Get restaurant profile
- `PUT /api/restaurant/profile` - Update basic profile
- `PUT /api/restaurant/contact` - Update contact information
- `PUT /api/restaurant/address` - Update address

### Menu Management
- `GET /api/restaurant/menu` - Get all menu items
- `POST /api/restaurant/menu/item` - Create menu item
- `PUT /api/restaurant/menu/item/{id}` - Update menu item
- `DELETE /api/restaurant/menu/item/{id}` - Delete menu item
- `PATCH /api/restaurant/menu/item/{id}/availability` - Toggle availability
- `POST /api/restaurant/menu/category` - Create menu category
- `GET /api/restaurant/menu/categories` - Get all categories

### Operating Hours
- `GET /api/restaurant/operating-hours` - Get operating hours
- `PUT /api/restaurant/operating-hours` - Update operating hours

### Account Security
- `POST /api/restaurant/change-password` - Change password

### Business Actions
- `POST /api/restaurant/withdrawal` - Submit withdrawal request
- `GET /api/restaurant/withdrawal/history` - Get withdrawal requests

---

## Notes

1. All request models include appropriate validation annotations (jakarta.validation.constraints)
2. All models use Lombok annotations (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor)
3. Models are designed to match exactly with the frontend UI components
4. Date/time fields use LocalDateTime for proper time zone handling
5. Price fields use BigDecimal for precise financial calculations

## Next Steps

To complete the integration:
1. Create Controller endpoints using these models
2. Implement Service layer business logic
3. Add proper authentication/authorization
4. Implement file upload handling for supporting documents and images
5. Add proper error handling and validation messages
