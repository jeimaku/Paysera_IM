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

// Note: Service requests and bookings functions have been removed
// since employees no longer interact with the system directly.
// Device deployment is now handled through the IT interface.