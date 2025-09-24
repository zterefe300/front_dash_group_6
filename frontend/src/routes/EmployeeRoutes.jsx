import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeHome from '../features/employee/pages/EmployeeHome.jsx'

const EmployeeRoutes = () => (
  <Routes>
     <Route path="/" element={<EmployeeHome />} />
    {/* Add more employee routes */}
  </Routes>
);

export default EmployeeRoutes;
