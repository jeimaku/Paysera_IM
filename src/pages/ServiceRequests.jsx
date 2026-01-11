import { useState, useEffect } from 'react';
import { ClipboardList, Search, Eye, Check, X, Trash2 } from 'lucide-react';
import RequestDetailsModal from '../components/Admin/RequestDetailsModal';
import {
  getAllServiceRequests,
  approveRequest,
  rejectRequest,
  completeRequest,
  deleteServiceRequest,
} from '../services/requestService';
import '../styles/requests.css';

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    device_type: '',
    request_type: '',
  });

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getAllServiceRequests(filters);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    const result = await approveRequest(requestId);

    if (result.success) {
      loadRequests();
    } else {
      alert('Failed to approve request: ' + result.error);
    }
    setActionLoading(null);
  };

  const handleReject = async (requestId) => {
    if (!confirm('Are you sure you want to reject this request?')) return;

    setActionLoading(requestId);
    const result = await rejectRequest(requestId);

    if (result.success) {
      loadRequests();
    } else {
      alert('Failed to reject request: ' + result.error);
    }
    setActionLoading(null);
  };

  const handleComplete = async (requestId) => {
    setActionLoading(requestId);
    const result = await completeRequest(requestId);

    if (result.success) {
      loadRequests();
    } else {
      alert('Failed to complete request: ' + result.error);
    }
    setActionLoading(null);
  };

  const handleDelete = async (requestId) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    const result = await deleteServiceRequest(requestId);

    if (result.success) {
      loadRequests();
    } else {
      alert('Failed to delete request: ' + result.error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'approved':
        return '#10b981';
      case 'completed':
        return '#0a0aa6';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="requests-container">
      <header className="requests-header">
        <div className="header-title">
          <ClipboardList size={32} className="header-icon" />
          <div>
            <h1>Service Requests</h1>
            <p className="subtitle">Manage device service requests from employees</p>
          </div>
        </div>
      </header>

      <div className="requests-stats">
        <div className="stat-item">
          <span className="stat-label">Total Requests</span>
          <span className="stat-value">{requests.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value stat-pending">
            {requests.filter((r) => r.status === 'pending').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Approved</span>
          <span className="stat-value stat-approved">
            {requests.filter((r) => r.status === 'approved').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed</span>
          <span className="stat-value stat-completed">
            {requests.filter((r) => r.status === 'completed').length}
          </span>
        </div>
      </div>

      <div className="requests-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by employee name or reason..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.device_type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, device_type: e.target.value }))
            }
          >
            <option value="">All Devices</option>
            <option value="LAPTOP">Laptop</option>
            <option value="DESKTOP">Desktop</option>
          </select>

          <select
            value={filters.request_type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, request_type: e.target.value }))
            }
          >
            <option value="">All Types</option>
            <option value="REQUEST">Request Device</option>
            <option value="SUPPORT">Support Device</option>
            <option value="RETURN">Return Device</option>
          </select>
        </div>
      </div>

      <div className="requests-table-card">
        {loading ? (
          <div className="loading">Loading service requests...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Device Type</th>
                  <th>Request Type</th>
                  <th>Reason</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No service requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.request_id}>
                      <td className="request-id">#{request.request_id}</td>
                      <td>{request.employees?.full_name || 'Unknown'}</td>
                      <td>
                        {request.employees?.departments?.department_name || 'N/A'}
                      </td>
                      <td>{request.device_type || 'N/A'}</td>
                      <td>{request.request_type}</td>
                      <td className="reason-cell">{request.reason}</td>
                      <td>{formatDate(request.date_submitted)}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(request.status)}20`,
                            color: getStatusColor(request.status),
                          }}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => handleViewDetails(request)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          {request.status === 'pending' && (
                            <>
                              <button
                                className="btn-icon btn-approve"
                                onClick={() => handleApprove(request.request_id)}
                                disabled={actionLoading === request.request_id}
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                className="btn-icon btn-reject"
                                onClick={() => handleReject(request.request_id)}
                                disabled={actionLoading === request.request_id}
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}

                          {request.status === 'approved' && (
                            <button
                              className="btn-icon btn-complete"
                              onClick={() => handleComplete(request.request_id)}
                              disabled={actionLoading === request.request_id}
                              title="Mark as Completed"
                            >
                              <Check size={16} />
                            </button>
                          )}

                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(request.request_id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}