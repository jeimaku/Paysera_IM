import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/Layout/AdminLayout';
import ITLayout from './components/Layout/ITLayout';
import Admin from './pages/Admin';
import IT from './pages/IT';
import EmployeeManagement from './pages/EmployeeManagement';
import LaptopInventory from './pages/LaptopInventory';
import DesktopInventory from './pages/DesktopInventory';
import ServiceRequests from './pages/ServiceRequests';
import Employee from './pages/Employee';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="laptops" element={<LaptopInventory />} />
        <Route path="desktops" element={<DesktopInventory />} />
        <Route path="requests" element={<ServiceRequests />} />
      </Route>

      {/* IT Routes */}
      <Route path="/it" element={<ITLayout />}>
        <Route index element={<IT />} />
        <Route path="laptops" element={<LaptopInventory />} />
        <Route path="desktops" element={<DesktopInventory />} />
        <Route path="requests" element={<ServiceRequests />} />
        {/* More IT routes will be added later */}
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={<Employee />} />
    </Routes>
  );
}