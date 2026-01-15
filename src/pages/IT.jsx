import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import DashboardStats from '../components/Admin/DashboardStats';
import ITRequests from '../components/Admin/ITRequests';
import TodaysBookings from '../components/Admin/TodaysBookings';
import {
  getDashboardStats,
  getServiceRequests,
  getTodaysBookings,
} from '../services/adminService';
import '../styles/admin.css';

export default function IT() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeEmployees: 0,
    laptopsDeployed: 0,
    pcsDeployed: 0,
  });
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, requestsData, bookingsData] = await Promise.all([
        getDashboardStats(),
        getServiceRequests(),
        getTodaysBookings(),
      ]);

      setStats(statsData);
      setRequests(requestsData);
      setBookings(bookingsData);
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

      <ITRequests requests={requests} />

      <TodaysBookings bookings={bookings} />
    </div>
  );
}