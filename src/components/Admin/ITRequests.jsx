export default function ITRequests({ requests }) {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="section-card">
      <h2 className="section-title">IT Service Requests</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Employee ID</th>
              <th>Employee</th>
              <th>Device Type</th>
              <th>Action</th>
              <th>Reason</th>
              <th>Date Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No service requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.request_id}>
                  <td>{request.request_id}</td>
                  <td>{request.employees?.employee_code || 'N/A'}</td>
                  <td>{request.employees?.full_name || 'Unknown'}</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}