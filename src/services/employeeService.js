import { supabase } from '../supabase/client';

// Get all employees with department and position details
export async function getEmployees(filters = {}) {
  try {
    let query = supabase
      .from('employees')
      .select(`
        employee_id,
        employee_code,
        full_name,
        date_deployed,
        date_left,
        status,
        departments (
          department_id,
          department_name
        ),
        positions (
          position_id,
          position_name
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.department_id) {
      query = query.eq('department_id', filters.department_id);
    }

    if (filters.position_id) {
      query = query.eq('position_id', filters.position_id);
    }

    if (filters.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,employee_code.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

// Get single employee by ID
export async function getEmployeeById(employeeId) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        departments (
          department_id,
          department_name
        ),
        positions (
          position_id,
          position_name
        )
      `)
      .eq('employee_id', employeeId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
}

// Create new employee
export async function createEmployee(employeeData) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          employee_code: employeeData.employee_code,
          full_name: employeeData.full_name,
          department_id: employeeData.department_id,
          position_id: employeeData.position_id,
          date_deployed: employeeData.date_deployed || null,
          status: employeeData.status || 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: error.message };
  }
}

// Update employee
export async function updateEmployee(employeeId, employeeData) {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({
        employee_code: employeeData.employee_code,
        full_name: employeeData.full_name,
        department_id: employeeData.department_id,
        position_id: employeeData.position_id,
        date_deployed: employeeData.date_deployed,
        date_left: employeeData.date_left,
        status: employeeData.status,
      })
      .eq('employee_id', employeeId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: error.message };
  }
}

// Delete employee
export async function deleteEmployee(employeeId) {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('employee_id', employeeId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: error.message };
  }
}

// Get all departments
export async function getDepartments() {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('department_name');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

// Get all positions
export async function getPositions() {
  try {
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .order('position_name');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
}