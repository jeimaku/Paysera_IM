import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import AdminLayout from './components/Layout/AdminLayout';
import ITLayout from './components/Layout/ITLayout';
import Admin from './pages/Admin/Admin';
import IT from './pages/IT/IT';
import EmployeeManagement from './pages/Admin/EmployeeManagement';
import LaptopInventory from './pages/Admin/LaptopInventory';
import DesktopInventory from './pages/Admin/DesktopInventory';
import MonitorInventory from './pages/Admin/MonitorInventory';
import DepartmentManagement from './pages/Admin/DepartmentManagement';
import PositionManagement from './pages/Admin/PositionManagement';

// IT Pages
import DeployDevice from './pages/IT/DeployDevice';
import EmployeeDevices from './pages/IT/EmployeeDevices';

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
        <Route path="monitors" element={<MonitorInventory />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="positions" element={<PositionManagement />} />
      </Route>

      {/* IT Routes */}
      <Route path="/it" element={<ITLayout />}>
        <Route index element={<IT />} />
        <Route path="deploy" element={<DeployDevice />} />
        <Route path="employee-devices" element={<EmployeeDevices />} />
        <Route path="laptops" element={<LaptopInventory />} />
        <Route path="desktops" element={<DesktopInventory />} />
        <Route path="monitors" element={<MonitorInventory />} />
      </Route>

    </Routes>
  );
}