import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import DashboardStats from '../../components/Admin/DashboardStats';
import {
  getDashboardStats,
} from '../../services/adminService';
import '../../styles/admin.css';

export default function IT() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeEmployees: 0,
    laptopsDeployed: 0,
    pcsDeployed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>IT Dashboard</h1>
          <p className="subtitle">Paysera Inventory Management System</p>
        </div>
      </header>

      <DashboardStats stats={stats} />

      {/* TODO: Add new IT-specific components here */}
      {/* Example: Employee list for deployment, recent deployments, etc. */}
      <div className="section-card">
        <h2 className="section-title">Device Deployments</h2>
        <p>Device deployment functionality will be added here.</p>
      </div>
    </div>
  );
}