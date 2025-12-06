import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerRoutes from './CustomerRoutes';
import RestaurantRoutes from './RestaurantRoutes';
import EmployeeRoutes from './EmployeeRoutes';

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/customer/*" element={<CustomerRoutes />} />
      <Route path="/" element={<Navigate to="/customer" replace />} />
      <Route path="*" element={<Navigate to="/customer" replace />} />

      <Route path="/restaurant/*" element={<RestaurantRoutes />} />
      <Route path="/employee/*" element={<EmployeeRoutes />} />
    </Routes>
  </Router>
);

export default AppRoutes;
