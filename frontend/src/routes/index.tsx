import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CustomerRoutes from './CustomerRoutes';
import RestaurantRoutes from './RestaurantRoutes';
import EmployeeRoutes from './EmployeeRoutes';

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      {/* <Route path="*" element={<CustomerRoutes />} /> */}
      <Route path="/restaurant/*" element={<RestaurantRoutes />} />
      <Route path="/employee/*" element={<EmployeeRoutes />} />
    </Routes>
  </Router>
);

export default AppRoutes;
