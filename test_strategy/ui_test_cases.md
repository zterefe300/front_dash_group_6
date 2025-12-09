# UI Test Cases for FrontDash Application

## Customer Portal Tests

1. **Customer Login Type Selection**
   - Navigate to customer login page
   - Verify login type selector displays options for customer, restaurant, and employee
   - Test navigation to respective portals

2. **Restaurant Listing**
   - Browse available restaurants
   - Verify restaurant cards display name, cuisine, rating, and status
   - Test search and filter functionality
   - Check pagination if applicable

3. **Restaurant Details**
   - Click on a restaurant card to view details
   - Verify menu items display with prices and descriptions
   - Test adding items to cart
   - Check operating hours display

4. **Cart Management**
   - Add multiple items from different restaurants (should handle separately)
   - Verify cart shows item quantities, prices, and totals
   - Test quantity adjustments and item removal
   - Check cart persistence across page refreshes

5. **Order Summary**
   - Review cart items before checkout
   - Verify subtotal, tax, and total calculations
   - Test modification of order details

6. **Delivery Information**
   - Enter delivery address and contact information
   - Test address validation
   - Verify delivery time estimation

7. **Payment Processing**
   - Enter payment details (mock payment)
   - Test payment form validation
   - Verify order confirmation after payment

8. **Order Confirmation**
   - Display order summary with tracking information
   - Test order tracking functionality

9. **Order History**
   - View past orders
   - Check order status updates
   - Test order details viewing

## Restaurant Portal Tests

10. **Restaurant Registration**
    - Fill out registration form with business details
    - Test form validation for required fields
    - Verify successful registration and auto-generated credentials

11. **Restaurant Login**
    - Login with provided credentials
    - Test password reset functionality
    - Verify session management

12. **Restaurant Dashboard**
    - View order statistics and recent orders
    - Check real-time order notifications
    - Verify dashboard data accuracy

13. **Menu Management**
    - Add new menu categories
    - Create menu items with prices and descriptions
    - Upload and manage item images
    - Test item availability toggles
    - Edit and delete menu items

14. **Operating Hours Management**
    - Set and update business hours for each day
    - Test different scheduling scenarios
    - Verify hours display on customer side

15. **Restaurant Profile Settings**
    - Update business information
    - Manage contact details
    - Test address/location updates

16. **Business Actions**
    - Submit withdrawal request
    - Check withdrawal status
    - Test business closure functionality

17. **Account Security**
    - Change restaurant password
    - Test password strength requirements
    - Verify security settings

## Employee Portal Tests

18. **Employee Login**
    - Login as admin or staff user
    - Test role-based access control
    - Verify login session timeout

19. **Admin Dashboard**
    - View system overview statistics
    - Check pending tasks and notifications
    - Test dashboard widgets functionality

20. **Registration Requests Management**
    - View pending restaurant registrations
    - Approve/reject registration requests
    - Test bulk approval actions
    - Verify notification to restaurants

21. **Active Restaurants Management**
    - View all active restaurants
    - Test restaurant status monitoring
    - Check restaurant performance metrics

22. **Withdrawal Requests Management**
    - Review restaurant withdrawal requests
    - Approve/reject withdrawal requests
    - Test automated restaurant deactivation

23. **Staff Management**
    - View all staff accounts
    - Add new staff members
    - Test staff role assignments
    - Manage staff permissions

24. **Driver Management**
    - View active drivers
    - Assign drivers to orders
    - Monitor driver availability and performance
    - Test driver status updates

25. **Order Management**
    - View all pending orders
    - Assign orders to drivers
    - Update order statuses
    - Test real-time order tracking

26. **Service Charge Management**
    - View current service charge percentage
    - Update service charge rates
    - Test charge calculations

27. **Admin Settings**
    - Change admin password
    - Test password policy enforcement
    - Verify account security

28. **Staff Account Settings**
    - Staff password changes
    - Profile information updates
    - Test first-time login password reset

## End-to-End Integration Test Scenarios

29. **Complete Order Flow: Customer → Staff Processing → Delivery**
    - Customer browses restaurants and places an order
    - Staff logs into employee portal and views pending orders
    - Staff assigns a driver to the order
    - Driver marks order as out for delivery
    - Driver marks order as delivered
    - Customer views order history and confirms delivery
    - Verify order status updates in all portals

30. **Restaurant Registration → Approval → Active Operation**
    - Restaurant submits registration request
    - Admin logs in and approves the registration
    - Restaurant receives auto-generated credentials via email
    - Restaurant logs in and sets up menu/profile
    - Restaurant goes live and receives first customer order
    - Verify status changes and notifications

31. **Restaurant Withdrawal → Approval → Deactivation**
    - Restaurant submits withdrawal request
    - Admin reviews and approves withdrawal
    - Restaurant account is deactivated
    - All restaurant data is archived/deleted
    - Customers can no longer see the restaurant
    - Verify clean data removal and status updates

32. **Staff Onboarding → First Login → Password Change**
    - Admin creates new staff account
    - Staff receives credentials
    - Staff logs in for first time and is forced to change password
    - Staff completes profile setup
    - Staff accesses assigned features based on role
    - Verify role-based permissions and access control

33. **Multi-Order Processing → Driver Assignment → Concurrent Deliveries**(SKIP)
    - Multiple customers place orders simultaneously
    - Staff assigns different drivers to different orders
    - Drivers update statuses independently
    - System handles concurrent status updates
    - All parties see real-time updates
    - Verify no data conflicts or race conditions

34. **Menu Update → Customer Visibility → Order Placement**
    - Restaurant updates menu items/prices
    - Changes reflect immediately on customer portal
    - Customer places order with updated items
    - Restaurant receives order with correct pricing
    - Verify data synchronization across portals

35. **Service Charge Update → Order Calculation → Revenue Impact**(SKIP)
    - Admin updates service charge percentage
    - New orders calculate charges correctly
    - Restaurant and customer see accurate totals
    - System generates correct revenue reports
    - Verify financial calculations across all orders

36. **Driver Status Changes → Order Assignment Logic**
    - Driver becomes unavailable during shift
    - Staff cannot assign orders to unavailable drivers
    - Driver becomes available again
    - Orders can be assigned normally
    - Verify real-time driver status propagation

37. **Failed Payment → Order Cancellation → Inventory Adjustment**
    - Customer attempts payment that fails
    - Order is cancelled automatically
    - Restaurant inventory is adjusted back
    - Customer receives cancellation notification
    - Verify transaction rollback and notifications

38. **Operating Hours Change → Customer Availability Display**
    - Restaurant updates operating hours
    - Customer portal shows updated availability
    - Orders are rejected outside business hours
    - Verify time-based order restrictions

39. **Bulk Staff Management → Permission Updates → Access Changes**
    - Admin updates multiple staff permissions
    - Staff members' access changes immediately
    - Previous sessions are invalidated if needed
    - Verify secure permission enforcement

40. **System Maintenance → User Notifications → Graceful Degradation**
    - Admin initiates maintenance mode
    - All users receive maintenance notifications
    - Non-essential features are disabled
    - Critical operations continue
    - Verify graceful system behavior

