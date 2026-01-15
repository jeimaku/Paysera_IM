import { supabase } from '../supabase/client';

// ==================== DEPLOYMENT MANAGEMENT ====================

// Get all employees (for IT to see who can receive devices)
export async function getEmployeesForDeployment() {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        employee_id,
        employee_code,
        full_name,
        departments (
          department_name
        ),
        positions (
          position_name
        ),
        status
      `)
      .eq('status', 'active')
      .order('full_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

// Get available devices for deployment (not currently issued)
export async function getAvailableDevices(deviceType) {
  try {
    const tableName = deviceType === 'LAPTOP' ? 'laptops' : 'desktops';
    const idField = deviceType === 'LAPTOP' ? 'laptop_id' : 'desktop_id';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('status', 'available')
      .order('asset_id');

    if (error) throw error;
    
    // Format data consistently
    return data?.map(device => ({
      ...device,
      device_id: device[idField],
      device_type: deviceType,
      display_name: `${device.asset_id} - ${device.brand || 'Unknown'} ${device.model || 'Unknown'}`
    })) || [];
  } catch (error) {
    console.error('Error fetching available devices:', error);
    return [];
  }
}

// Deploy device to employee
export async function deployDevice(deploymentData) {
  try {
    const { employeeId, deviceType, deviceId, monitorIds = [] } = deploymentData;
    
    // Step 1: Create employee_device record
    const { data: employeeDevice, error: deployError } = await supabase
      .from('employee_devices')
      .insert({
        employee_id: employeeId,
        device_type: deviceType,
        device_id: deviceId,
        date_issued: new Date().toISOString().split('T')[0],
        status: 'in_use'
      })
      .select()
      .single();

    if (deployError) throw deployError;

    // Step 2: Update device status to 'issued'
    const tableName = deviceType === 'LAPTOP' ? 'laptops' : 'desktops';
    const idField = deviceType === 'LAPTOP' ? 'laptop_id' : 'desktop_id';
    
    const { error: deviceUpdateError } = await supabase
      .from(tableName)
      .update({ status: 'issued' })
      .eq(idField, deviceId);

    if (deviceUpdateError) throw deviceUpdateError;

    // Step 3: Assign monitors if provided
    if (monitorIds.length > 0) {
      const monitorAssignments = monitorIds.map(monitorId => ({
        employee_device_id: employeeDevice.employee_device_id,
        monitor_id: monitorId
      }));

      const { error: monitorError } = await supabase
        .from('employee_monitors')
        .insert(monitorAssignments);

      if (monitorError) throw monitorError;

      // Update monitor status to 'issued'
      const { error: monitorUpdateError } = await supabase
        .from('monitors')
        .update({ status: 'issued' })
        .in('monitor_id', monitorIds);

      if (monitorUpdateError) throw monitorUpdateError;
    }

    return { success: true, data: employeeDevice };
  } catch (error) {
    console.error('Error deploying device:', error);
    return { success: false, error: error.message };
  }
}

// Get all current deployments
export async function getCurrentDeployments() {
  try {
    const { data, error } = await supabase
      .from('employee_devices')
      .select(`
        employee_device_id,
        device_type,
        device_id,
        date_issued,
        status,
        employees (
          employee_id,
          employee_code,
          full_name,
          departments (
            department_name
          )
        ),
        employee_monitors (
          monitor_id,
          monitors (
            asset_id,
            brand,
            model
          )
        )
      `)
      .eq('status', 'in_use')
      .order('date_issued', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching current deployments:', error);
    return [];
  }
}

// Return device (end deployment)
export async function returnDevice(employeeDeviceId) {
  try {
    // Get deployment details first
    const { data: deployment, error: fetchError } = await supabase
      .from('employee_devices')
      .select(`
        device_type,
        device_id,
        employee_monitors (
          monitor_id
        )
      `)
      .eq('employee_device_id', employeeDeviceId)
      .single();

    if (fetchError) throw fetchError;

    // Step 1: Update employee_device status
    const { error: updateError } = await supabase
      .from('employee_devices')
      .update({ 
        status: 'returned',
        date_returned: new Date().toISOString().split('T')[0]
      })
      .eq('employee_device_id', employeeDeviceId);

    if (updateError) throw updateError;

    // Step 2: Update device status to 'available'
    const tableName = deployment.device_type === 'LAPTOP' ? 'laptops' : 'desktops';
    const idField = deployment.device_type === 'LAPTOP' ? 'laptop_id' : 'desktop_id';
    
    const { error: deviceUpdateError } = await supabase
      .from(tableName)
      .update({ status: 'available' })
      .eq(idField, deployment.device_id);

    if (deviceUpdateError) throw deviceUpdateError;

    // Step 3: Return monitors if any
    if (deployment.employee_monitors?.length > 0) {
      const monitorIds = deployment.employee_monitors.map(m => m.monitor_id);
      
      const { error: monitorUpdateError } = await supabase
        .from('monitors')
        .update({ status: 'available' })
        .in('monitor_id', monitorIds);

      if (monitorUpdateError) throw monitorUpdateError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error returning device:', error);
    return { success: false, error: error.message };
  }
}

// Get available monitors for deployment
export async function getAvailableMonitors() {
  try {
    const { data, error } = await supabase
      .from('monitors')
      .select('*')
      .eq('status', 'available')
      .order('asset_id');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching available monitors:', error);
    return [];
  }
}