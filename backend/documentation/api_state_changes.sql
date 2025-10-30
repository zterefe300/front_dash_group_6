-- SQL queries to show table state before and after state-changing API calls
-- Corresponding to the Postman collection requests

-- Before POST /api/orders (A new order is created and saved)
SELECT * FROM Orders;

-- After POST /api/orders (A new order is created and saved)
SELECT * FROM Orders ORDER BY order_id DESC LIMIT 1;

-- Before POST /api/orders/{id}/assign-driver (An existing order is retrieved, assigned a driver and saved)
SELECT order_id, assigned_driver_id, order_status FROM Orders WHERE order_id = 1;

-- After POST /api/orders/{id}/assign-driver (An existing order is retrieved, assigned a driver and saved)
SELECT order_id, assigned_driver_id, order_status FROM Orders WHERE order_id = 1;

-- Before PATCH /api/orders/{id}/delivery (An existing order is retrieved, updated with delivery time and saved)
SELECT order_id, delivery_time, order_status FROM Orders WHERE order_id = 1;

-- After PATCH /api/orders/{id}/delivery (An existing order is retrieved, updated with delivery time and saved)
SELECT order_id, delivery_time, order_status FROM Orders WHERE order_id = 1;

-- Before POST /api/staff (A new staff member account is created and saved)
SELECT * FROM StaffUsers;

-- After POST /api/staff (A new staff member account is created and saved)
SELECT * FROM StaffUsers WHERE username = 'smith01';
SELECT * FROM EmployeeLogin WHERE username = 'smith01';

-- Before DELETE /api/staff/{id} (A staff member account is deleted or inactivated)
SELECT * FROM StaffUsers WHERE username = 'smith01';
SELECT * FROM EmployeeLogin WHERE username = 'smith01';

-- After DELETE /api/staff/{id} (A staff member account is deleted or inactivated)
SELECT * FROM StaffUsers WHERE username = 'smith01';
SELECT * FROM EmployeeLogin WHERE username = 'smith01';

-- Before POST /api/drivers (A new driver record added to the system)
SELECT * FROM Driver;

-- After POST /api/drivers (A new driver record added to the system)
SELECT * FROM Driver ORDER BY driver_id DESC LIMIT 1;

-- Before DELETE /api/drivers/{id} (An driver record is deleted or inactivated)
SELECT * FROM Driver WHERE driver_id = 4;

-- After DELETE /api/drivers/{id} (An driver record is deleted or inactivated)
SELECT * FROM Driver WHERE driver_id = 4;

-- Before PUT /api/restaurant/{id}/menu (Restaurant owner modifies a menu item and saves)
SELECT * FROM MenuItem WHERE menu_item_id = 1;

-- After PUT /api/restaurant/{id}/menu (Restaurant owner modifies a menu item and saves)
SELECT * FROM MenuItem WHERE menu_item_id = 1;

-- Before PUT /api/restaurant/{id}/hours (Restaurant owner modifies operating hours and saves)
SELECT * FROM OperatingHour WHERE restaurant_id = 1;

-- After PUT /api/restaurant/{id}/hours (Restaurant owner modifies operating hours and saves)
SELECT * FROM OperatingHour WHERE restaurant_id = 1;

-- Before POST /api/restaurant/registration (A new restaurant registration request is created and saved)
SELECT * FROM Restaurant;

-- After POST /api/restaurant/registration (A new restaurant registration request is created and saved)
SELECT * FROM Restaurant WHERE name = 'New Restaurant';
SELECT * FROM RestaurantLogin WHERE user_name = 'new_rest';

-- Before POST /api/restaurant/withdrawal (A restaurant withdrawal request is created and saved)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 1;

-- After POST /api/restaurant/withdrawal (A restaurant withdrawal request is created and saved)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 1;

-- Before PUT /api/admin/registrations/{id}/approve (Administrator approves a restaurant registration request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 3;

-- After PUT /api/admin/registrations/{id}/approve (Administrator approves a restaurant registration request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 3;

-- Before PUT /api/admin/registrations/{id}/reject (Administrator rejects a restaurant registration request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 3;

-- After PUT /api/admin/registrations/{id}/reject (Administrator rejects a restaurant registration request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 3;

-- Before PUT /api/admin/withdrawals/{id}/approve (Administrator approves a restaurant withdrawal request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 4;

-- After PUT /api/admin/withdrawals/{id}/approve (Administrator approves a restaurant withdrawal request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 4;

-- Before PUT /api/admin/withdrawals/{id}/reject (Administrator rejects a restaurant withdrawal request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 4;

-- After PUT /api/admin/withdrawals/{id}/reject (Administrator rejects a restaurant withdrawal request)
SELECT restaurant_id, status FROM Restaurant WHERE restaurant_id = 4;
