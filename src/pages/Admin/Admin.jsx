import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import DashboardStats from '../../components/Admin/DashboardStats';
import {
  getDashboardStats,
} from '../../services/adminService';
import '../../styles/admin.css';

export default function Admin() {
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      navigate('/');
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
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Paysera Inventory Management System</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <DashboardStats stats={stats} />

      {/* TODO: Add admin-specific overview components */}
      {/* Example: Recent employee additions, inventory summary, etc. */}
      <div className="section-card">
        <h2 className="section-title">System Overview</h2>
        <p>Admin overview functionality will be enhanced here.</p>
      </div>
    </div>
  );
}