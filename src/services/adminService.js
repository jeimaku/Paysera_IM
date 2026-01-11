import { supabase } from '../supabase/client';

// Get dashboard statistics
export async function getDashboardStats() {
  try {
    // Count active employees
    const { count: activeEmployees, error: empError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (empError) throw empError;

    // Count deployed laptops
    const { count: laptopsDeployed, error: laptopError } = await supabase
      .from('employee_devices')
      .select('*', { count: 'exact', head: true })
      .eq('device_type', 'LAPTOP')
      .eq('status', 'in_use');

    if (laptopError) throw laptopError;

    // Count deployed PCs
    const { count: pcsDeployed, error: pcError } = await supabase
      .from('employee_devices')
      .select('*', { count: 'exact', head: true })
      .eq('device_type', 'DESKTOP')
      .eq('status', 'in_use');

    if (pcError) throw pcError;

    return {
      activeEmployees: activeEmployees || 0,
      laptopsDeployed: laptopsDeployed || 0,
      pcsDeployed: pcsDeployed || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      activeEmployees: 0,
      laptopsDeployed: 0,
      pcsDeployed: 0,
    };
  }
}

// Get IT service requests
export async function getServiceRequests() {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        request_id,
        device_type,
        request_type,
        reason,
        status,
        date_submitted,
        employees (
          employee_id,
          employee_code,
          full_name
        )
      `)
      .order('date_submitted', { ascending: false })
      .limit(10);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return [];
  }
}

// Get today's bookings
export async function getTodaysBookings() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        booking_id,
        booking_date,
        booking_time,
        method,
        courier_name,
        status,
        service_requests (
          request_id,
          device_type,
          request_type,
          employees (
            employee_id,
            employee_code,
            full_name
          )
        )
      `)
      .eq('booking_date', today)
      .order('booking_time', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching today\'s bookings:', error);
    return [];
  }
}

