import { supabase } from '../supabase/client';

// Get all service requests with filters
export async function getAllServiceRequests(filters = {}) {
  try {
    let query = supabase
      .from('service_requests')
      .select(`
        request_id,
        device_type,
        device_id,
        request_type,
        reason,
        status,
        date_submitted,
        date_completed,
        employees (
          employee_id,
          employee_code,
          full_name,
          departments (
            department_name
          )
        )
      `)
      .order('date_submitted', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.device_type) {
      query = query.eq('device_type', filters.device_type);
    }

    if (filters.request_type) {
      query = query.eq('request_type', filters.request_type);
    }

    if (filters.search) {
      query = query.or(
        `reason.ilike.%${filters.search}%,employees.full_name.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return [];
  }
}

// Get single service request by ID
export async function getServiceRequestById(requestId) {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        employees (
          employee_id,
          employee_code,
          full_name,
          departments (
            department_name
          ),
          positions (
            position_name
          )
        )
      `)
      .eq('request_id', requestId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching service request:', error);
    return null;
  }
}

// Update service request status
export async function updateRequestStatus(requestId, status, completedDate = null) {
  try {
    const updateData = {
      status,
      ...(completedDate && { date_completed: completedDate }),
    };

    const { data, error } = await supabase
      .from('service_requests')
      .update(updateData)
      .eq('request_id', requestId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating request status:', error);
    return { success: false, error: error.message };
  }
}

// Approve request
export async function approveRequest(requestId) {
  return updateRequestStatus(requestId, 'approved');
}

// Reject request
export async function rejectRequest(requestId) {
  return updateRequestStatus(requestId, 'rejected', new Date().toISOString());
}

// Complete request
export async function completeRequest(requestId) {
  return updateRequestStatus(requestId, 'completed', new Date().toISOString());
}

// Delete service request
export async function deleteServiceRequest(requestId) {
  try {
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('request_id', requestId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting service request:', error);
    return { success: false, error: error.message };
  }
}