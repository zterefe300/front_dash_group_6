-- ==========================================================
-- MOCK DATA INSERTION SECTION
-- ==========================================================

-- Insert mock data into Address
INSERT INTO Address (street_address, city, state, zip_code) VALUES
('123 Maple St', 'Austin', 'TX', '73301'),
('456 Elm Rd', 'Dallas', 'TX', '75201'),
('789 Pine Ave', 'Houston', 'TX', '77002'),
('321 Oak Blvd', 'San Antonio', 'TX', '78205'),
('654 Cedar Ln', 'Plano', 'TX', '75023');

-- Insert mock data into Restaurant
INSERT INTO Restaurant (name, cuisine_type, picture_url, address_id, phone_number, contact_person_name, email_address, status) VALUES
('Taco Fiesta', 'Mexican', 'https://picsum.photos/200?1', 1, '512-555-1111', 'Carlos Mendez', 'contact@tacofiesta.com', 'ACTIVE'),
('Burger Barn', 'American', 'https://picsum.photos/200?2', 2, '214-555-2222', 'Sarah Johnson', 'info@burgerbarn.com', 'ACTIVE'),
('Sushi Zen', 'Japanese', 'https://picsum.photos/200?3', 3, '713-555-3333', 'Kenji Ito', 'hello@sushizen.com', 'NEW_REG'),
('Curry Palace', 'Indian', 'https://picsum.photos/200?4', 4, '210-555-4444', 'Priya Patel', 'admin@currypalace.com', 'WITHDRAW_REQ');

-- Insert mock data into RestaurantLogin
INSERT INTO RestaurantLogin (user_name, restaurant_id, password) VALUES
('tacofiesta_admin', 1, 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'), -- password123
('burgerbarn_owner', 2, 'fbb4a8a163ffa958b4f02bf9cabb30cfefb40de803f2c4c346a9d39b3be1b544'), -- securepass
('sushizen_login', 3, '0ec430dca0d1f5627bcdfa36b42069404a45b13127fe8eaae8f67d4555466d4f'), -- sushi@2024
('currypalace_admin', 4, '546329d8a769419d3c8287339ae75b54122ff95523a83f4320981ae808798b76'); -- currylover

-- Insert mock data into MenuCategory
INSERT INTO MenuCategory (restaurant_id, category_name) VALUES
(1, 'Tacos'),
(1, 'Sides'),
(2, 'Burgers'),
(2, 'Fries'),
(3, 'Sushi Rolls'),
(4, 'Curry Dishes');

-- Insert mock data into MenuItem
INSERT INTO MenuItem (category_id, item_name, picture_url, price, availability) VALUES
(1, 'Chicken Taco', 'https://picsum.photos/200?11', 4.99, 'AVAILABLE'),
(1, 'Beef Taco', 'https://picsum.photos/200?12', 5.49, 'AVAILABLE'),
(2, 'Churros', 'https://picsum.photos/200?13', 3.25, 'AVAILABLE'),
(3, 'Classic Burger', 'https://picsum.photos/200?21', 8.99, 'AVAILABLE'),
(3, 'Cheese Burger', 'https://picsum.photos/200?22', 9.49, 'AVAILABLE'),
(4, 'Fries Basket', 'https://picsum.photos/200?23', 3.99, 'AVAILABLE'),
(5, 'California Roll', 'https://picsum.photos/200?31', 7.99, 'AVAILABLE'),
(6, 'Butter Chicken', 'https://picsum.photos/200?41', 12.49, 'AVAILABLE'),
(6, 'Paneer Masala', 'https://picsum.photos/200?42', 11.99, 'AVAILABLE');

-- Insert mock data into OperatingHour
INSERT INTO OperatingHour (restaurant_id, week_day, open_time, close_time) VALUES
(1, 'Monday', '09:00:00', '21:00:00'),
(1, 'Tuesday', '09:00:00', '21:00:00'),
(2, 'Monday', '10:00:00', '22:00:00'),
(3, 'Friday', '11:00:00', '23:00:00'),
(4, 'Sunday', '10:00:00', '20:00:00');

-- Insert mock data into EmployeeLogin
INSERT INTO EmployeeLogin (username, password, employeeType) VALUES
('doe01', '713bfda78870bf9d1b261f565286f85e97ee614efe5f0faf7c34e7ca4f65baca', 'ADMIN'), -- adminpass
('thompson02', '10176e7b7b24d317acfcf8d2064cfd2f24e154f7b5a96603077d5ef813d6a6b6', 'STAFF'), -- staff123
('wong03', '8f5dada329d6ade1fdba5e207b5a81b312ae838801ca287a00e9428620808dce', 'STAFF'); -- staff456

-- Insert mock data into StaffUsers
INSERT INTO StaffUsers (username, firstname, lastname) VALUES
('doe01', 'Jane', 'Doe'),
('thompson02', 'Mike', 'Thompson'),
('wong03', 'Lisa', 'Wong');

-- Insert mock data into Driver
INSERT INTO Driver (firstname, lastname, availability_status) VALUES
('John', 'Smith', 'AVAILABLE'),
('Emily', 'Carter', 'BUSY'),
('Robert', 'Brown', 'AVAILABLE');

-- Insert mock data into Orders
INSERT INTO Orders (restaurant_id, customer_name, customer_phone, address_id, total_amount, order_time, assigned_driver_id, estimated_delivery_time, order_status, tips, subtotal, delivery_time) VALUES
(1, 'Alice Johnson', '512-123-4567', 5, 25.48, NOW(), 1, DATE_ADD(NOW(), INTERVAL 45 MINUTE), 'OUT_FOR_DELIVERY', 3.00, 22.48, NULL),
(2, 'Bob Williams', '214-234-5678', 3, 18.98, NOW(), NULL, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 'PENDING', 2.00, 16.98, NULL),
(4, 'Charlie Nguyen', '210-345-6789', 4, 14.99, NOW(), 3, DATE_ADD(NOW(), INTERVAL 50 MINUTE), 'DELIVERED', 1.00, 13.99, NOW());

-- Insert mock data into OrderItem
INSERT INTO OrderItem (order_id, menu_item_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 4, 2),
(3, 8, 1);
