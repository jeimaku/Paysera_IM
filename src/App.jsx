import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/Layout/AdminLayout';
import Admin from './pages/Admin';
import EmployeeManagement from './pages/EmployeeManagement';
import LaptopInventory from './pages/LaptopInventory';
import Employee from './pages/Employee';
import ServiceRequests from './pages/ServiceRequests';
import DesktopInventory from './pages/DesktopInventory';
import IT from './pages/IT';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      {/* Admin Routes with Sidebar Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="laptops" element={<LaptopInventory />} />
        <Route path="requests" element={<ServiceRequests />} />
        <Route path="desktops" element={<DesktopInventory />} />

        {/* Add more admin routes here */}
      </Route>

      {/* Other Routes */}
      <Route path="/employee" element={<Employee />} />
      <Route path="/it" element={<IT />} />
    </Routes>
  );
}