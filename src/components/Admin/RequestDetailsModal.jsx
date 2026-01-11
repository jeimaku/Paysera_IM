import { X, User, Briefcase, Calendar, FileText } from 'lucide-react';

export default function RequestDetailsModal({ isOpen, onClose, request }) {
  if (!isOpen || !request) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="request-details">
          {/* Request Info */}
          <div className="detail-section">
            <h3 className="detail-section-title">Request Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Request ID</span>
                <span className="detail-value">#{request.request_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: `${getStatusColor(request.status)}20`,
                    color: getStatusColor(request.status),
                  }}
                >
                  {request.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Device Type</span>
                <span className="detail-value">{request.device_type || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Request Type</span>
                <span className="detail-value">{request.request_type}</span>
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <User size={16} />
              Employee Information
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Employee</span>
                <span className="detail-value">
                  {request.employees?.full_name || 'Unknown'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Employee Code</span>
                <span className="detail-value">
                  {request.employees?.employee_code || 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">
                  {request.employees?.departments?.department_name || 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Position</span>
                <span className="detail-value">
                  {request.employees?.positions?.position_name || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <Calendar size={16} />
              Timeline
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Date Submitted</span>
                <span className="detail-value">
                  {formatDate(request.date_submitted)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date Completed</span>
                <span className="detail-value">
                  {formatDate(request.date_completed)}
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <FileText size={16} />
              Reason
            </h3>
            <div className="reason-box">{request.reason}</div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}