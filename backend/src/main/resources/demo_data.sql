-- Demo data based on application_test_data_report

-- Insert data into Address
INSERT INTO Address (address_id, street_address, bldg, city, state, zip_code) VALUES
(1, 'Lake Street', '234', 'Boston', 'MA', '02132'),
(2, 'Hobatt Road', '719', 'Chestnut Hill', 'MA', '02129'),
(3, 'Park Avenue', '28093', 'Newton Corner', 'MA', '02125'),
(4, 'Langley Road', '77', 'Brighton', 'MA', '02239'),
(5, 'Stuart Road', '361', 'College Town', 'MA', '02129'),
(6, 'Everett Street', '45', 'Chestnut Hill', 'MA', '02129'),
(7, 'Breck Avenue', '82564', 'Brighton', 'MA', '02239'),
(8, 'Blake Street', '75', 'Edmonds Park', 'MA', '02134'),
(9, 'Langley Road', '89', 'Brighton', 'MA', '02239'),
(10, 'University Avenue', '387', 'Corey Hill', 'MA', '02491'),
(11, 'Queensberry Street', '433', 'West Fens', 'MA', '02201'),
(12, 'Commonwealth Avenue', '4', 'Griggs Park', 'MA', '02330'),
(13, 'Rocket Hall', '345', 'Boston', 'MA', '02007'),
(14, 'Chatham Street', '75', 'Longwood', 'MA', '02196'),
(15, 'Brock Street', '2323', 'Central Village', 'MA', '02342'),
(16, 'Davis Avenue', '563', 'Brookline', 'MA', '02342'),
(17, 'Kent Street', '6256', 'Central Village', 'MA', '02342'),
(18, 'York Terrace', '17286', 'Corey Hill', 'MA', '02491');

-- Insert data into Restaurant
INSERT INTO Restaurant (restaurant_id, name, cuisine_type, picture_url, address_id, phone_number, contact_person_name, email_address, status) VALUES
(1, 'All Chicken Meals', '', '', 1, '617-478-3785', 'Laura Wimbleton', 'info@allchickenmeals.com', 'ACTIVE'),
(2, 'Pizza Only', '', '', 2, '857-477-2773', 'Russel Beverton', 'info@pizzaonly.com', 'ACTIVE'),
(3, 'Best Burgers', '', '', 3, '781-467-0073', 'Eager Alloysis', 'info@bestburgers.com', 'ACTIVE');

-- Insert data into RestaurantLogin
INSERT INTO RestaurantLogin (user_name, restaurant_id, password) VALUES
('restaurant1', 1, 'password'),
('restaurant2', 2, 'password'),
('restaurant3', 3, 'password');

-- Insert data into OperatingHour
INSERT INTO OperatingHour (operating_hour_id, restaurant_id, week_day, open_time, close_time) VALUES
(1, 1, 'MONDAY', '09:00:00', '21:00:00'),
(2, 1, 'TUESDAY', '09:00:00', '21:00:00'),
(3, 1, 'WEDNESDAY', '09:00:00', '21:00:00'),
(4, 1, 'THURSDAY', '09:00:00', '21:00:00'),
(5, 1, 'FRIDAY', '09:00:00', '21:00:00'),
(6, 1, 'SATURDAY', '08:00:00', '22:00:00'),
(7, 1, 'SUNDAY', '08:00:00', '22:00:00'),
(8, 2, 'MONDAY', '00:00:00', '24:00:00'),
(9, 2, 'TUESDAY', '00:00:00', '24:00:00'),
(10, 2, 'WEDNESDAY', '00:00:00', '24:00:00'),
(11, 2, 'THURSDAY', '00:00:00', '24:00:00'),
(12, 2, 'FRIDAY', NULL, NULL),
(13, 2, 'SATURDAY', '10:00:00', '24:00:00'),
(14, 2, 'SUNDAY', '10:00:00', '24:00:00'),
(15, 3, 'MONDAY', '09:00:00', '24:00:00'),
(16, 3, 'TUESDAY', '09:00:00', '24:00:00'),
(17, 3, 'WEDNESDAY', '09:00:00', '24:00:00'),
(18, 3, 'THURSDAY', '09:00:00', '24:00:00'),
(19, 3, 'FRIDAY', '09:00:00', '24:00:00'),
(20, 3, 'SATURDAY', NULL, NULL),
(21, 3, 'SUNDAY', NULL, NULL);

-- Insert data into MenuCategory
INSERT INTO MenuCategory (category_id, restaurant_id, category_name) VALUES
(1, 1, 'Chicken Meals'),
(2, 2, 'Pizza'),
(3, 3, 'Burgers');

-- Insert data into MenuItem
INSERT INTO MenuItem (menu_item_id, category_id, item_name, picture_url, price, availability) VALUES
(1, 1, 'Nuggets', '', 5.99, 'AVAILABLE'),
(2, 1, 'Wings', '', 10.99, 'AVAILABLE'),
(3, 1, 'Combo', '', 23.99, 'AVAILABLE'),
(4, 1, 'Sandwich', '', 8.99, 'AVAILABLE'),
(5, 1, 'Wrap', '', 6.99, 'AVAILABLE'),
(6, 2, 'Pepperoni(Small)', '', 12.99, 'AVAILABLE'),
(7, 2, 'Pepperoni(Large)', '', 17.99, 'AVAILABLE'),
(8, 2, 'Supreme', '', 21.99, 'AVAILABLE'),
(9, 2, 'Hawaiian', '', 24.99, 'AVAILABLE'),
(10, 2, 'Your 3 topping', '', 15.99, 'AVAILABLE'),
(11, 3, 'Butter burger', '', 9.99, 'AVAILABLE'),
(12, 3, 'Cheese Burger', '', 5.99, 'AVAILABLE'),
(13, 3, 'Hamburger', '', 4.99, 'AVAILABLE'),
(14, 3, 'BBSpecial', '', 12.99, 'AVAILABLE'),
(15, 3, 'BBDouble', '', 11.99, 'AVAILABLE');

-- Insert data into Driver
INSERT INTO Driver (driver_id, firstname, lastname, availability_status) VALUES
(1, 'Shawn', 'Murray', 'AVAILABLE'),
(2, 'Alex', 'Shopper', 'AVAILABLE'),
(3, 'Lisa', 'Graham', 'AVAILABLE'),
(4, 'Ryan', 'Graham', 'AVAILABLE'),
(5, 'Marcus', 'Shane', 'AVAILABLE'),
(6, 'Vicky', 'Kissinger', 'AVAILABLE'),
(7, 'Lucy', 'Gordon', 'AVAILABLE');

-- Insert data into EmployeeLogin
INSERT INTO EmployeeLogin (username, password, employeeType, dateCreated) VALUES
('richard01', '', 'STAFF', NULL),
('cox02', '', 'STAFF', NULL),
('deckon03', '', 'STAFF', NULL),
('cox04', '', 'STAFF', NULL),
('mullard05', '', 'STAFF', NULL);

-- Insert data into StaffUsers
INSERT INTO StaffUsers (username, firstname, lastname) VALUES
('richard01', 'Amanda', 'Richard'),
('cox02', 'Arthur', 'Cox'),
('deckon03', 'Charles', 'Deckon'),
('cox04', 'Francis', 'Cox'),
('mullard05', 'Sarah', 'Mullard');

-- Insert data into Orders
INSERT INTO Orders (order_id, restaurant_id, customer_name, customer_phone, address_id, total_amount, order_time, assigned_driver_id, estimated_delivery_time, order_status, tips, subtotal, delivery_time) VALUES
('FD0001', 1, 'Martha Washington', '617-478-5869', 4, NULL, '2025-11-30 17:32:00', 1, '2025-11-30 18:07:00', 'DELIVERED', 3.00, NULL, '2025-11-30 18:10:00'),
('FD0002', 1, 'Raven Clinch', '617-707-4682', 5, NULL, '2025-11-30 21:21:00', 2, '2025-11-30 22:06:00', 'DELIVERED', 5.00, NULL, '2025-11-30 22:32:00'),
('FD0003', 1, 'Brian Anderson', '339-688-0896', 6, NULL, '2025-11-30 12:41:00', 1, '2025-11-30 12:56:00', 'DELIVERED', 0.00, NULL, '2025-11-30 12:51:00'),
('FD0004', 1, 'Elaine Mikowsky', '857-478-0267', 7, NULL, '2025-12-01 13:03:00', 3, '2025-12-01 14:43:00', 'DELIVERED', 0.00, NULL, '2025-12-01 15:01:00'),
('FD0005', 1, 'Raj Sinha', '617-936-1143', 8, NULL, '2025-11-30 20:45:00', 2, '2025-11-30 21:00:00', 'DELIVERED', 5.00, NULL, '2025-11-30 21:03:00'),
('FD0101', 2, 'Aram Shankar', '857-289-2774', 9, NULL, '2025-12-01 17:40:00', 1, '2025-12-01 18:10:00', 'DELIVERED', 2.00, NULL, '2025-12-01 18:13:00'),
('FD0102', 2, 'Aram Shankar', '857-289-2774', 9, NULL, '2025-12-02 15:30:00', 2, '2025-12-02 15:58:00', 'DELIVERED', 2.00, NULL, '2025-12-02 15:58:00'),
('FD0103', 2, 'Ramon Swagger', '781-678-2552', 10, NULL, '2025-12-02 14:00:00', 2, '2025-12-02 14:30:00', 'DELIVERED', 0.00, NULL, '2025-12-02 14:22:00'),
('FD0104', 2, 'Ayesha Mohammad', '617-522-9965', 11, NULL, '2025-12-02 11:45:00', 5, '2025-12-02 12:10:00', 'DELIVERED', 0.00, NULL, '2025-12-02 12:30:00'),
('FD0201', 3, 'William Dean', '781-666-2416', 12, NULL, '2025-12-01 13:27:00', 4, '2025-12-01 13:42:00', 'DELIVERED', 0.00, NULL, '2025-12-01 13:38:00'),
('FD0202', 3, 'Sean Oxford', '617-832-5554', 13, NULL, '2025-12-01 09:32:00', 3, '2025-12-01 10:57:00', 'DELIVERED', 0.00, NULL, '2025-12-01 15:30:00'),
('FD0108', 2, 'Rachel Meyer', '857-273-1010', 14, NULL, '2025-12-02 00:00:00', NULL, NULL, 'PENDING', 10.00, NULL, NULL),
('FD0043', 1, 'Fu Wang', '617-357-7772', 15, NULL, '2025-12-02 00:00:00', NULL, NULL, 'PENDING', 22.00, NULL, NULL),
('FD0044', 1, 'Cliff Hans', '857-256-9863', 16, NULL, '2025-12-02 00:00:00', NULL, NULL, 'PENDING', 5.00, NULL, NULL),
('FD0208', 3, 'Graham Walter', '781-491-0166', 17, NULL, '2025-12-02 00:00:00', NULL, NULL, 'PENDING', 15.00, NULL, NULL),
('FD0209', 3, 'Lisa Manters', '617-413-5588', 18, NULL, '2025-12-02 00:00:00', NULL, NULL, 'PENDING', 5.00, NULL, NULL),
('FD0109', 2, 'Aram Shankar', '857-289-2774', 9, NULL, '2025-12-02 00:00:00', NULL, NULL, 'PENDING', 18.00, NULL, NULL),
('FD0045', 1, 'Brian Anderson', '339-688-0896', 6, NULL, '2025-12-02 00:00:00', NULL, NULL, 'PENDING', 10.00, NULL, NULL);

-- Insert data into OrderItem
INSERT INTO OrderItem (order_id, menu_item_id, quantity) VALUES
('FD0001', 4, 3),
('FD0002', 1, 10),
('FD0003', 4, 1),
('FD0003', 1, 1),
('FD0003', 5, 2),
('FD0004', 4, 10),
('FD0004', 5, 10),
('FD0004', 3, 10),
('FD0005', 2, 3),
('FD0005', 1, 3),
('FD0101', 8, 2),
('FD0102', 7, 2),
('FD0103', 8, 1),
('FD0103', 9, 2),
('FD0103', 10, 1),
('FD0104', 6, 5),
('FD0104', 9, 2),
('FD0104', 10, 2),
('FD0201', 13, 7),
('FD0201', 12, 3),
('FD0202', 11, 10),
('FD0202', 12, 5),
('FD0202', 14, 12),
('FD0202', 15, 7),
('FD0108', 9, 3),
('FD0108', 8, 2),
('FD0043', 3, 5),
('FD0043', 5, 12),
('FD0044', 4, 8),
('FD0208', 14, 10),
('FD0208', 15, 6),
('FD0208', 12, 2),
('FD0209', 13, 5),
('FD0209', 12, 5),
('FD0209', 11, 2),
('FD0109', 6, 2),
('FD0109', 7, 2),
('FD0109', 9, 2),
('FD0109', 8, 2),
('FD0045', 4, 5),
('FD0045', 3, 5),
('FD0045', 5, 5);
