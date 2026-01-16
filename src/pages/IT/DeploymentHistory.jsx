import { useState, useEffect } from 'react';
import { History, Eye, Calendar, User, Package, Monitor as MonitorIcon } from 'lucide-react';
import InteractiveDeviceSpecModal from '../../components/IT/InteractiveDeviceSpecModal';
import { getDeploymentHistory } from '../../services/deploymentService';
import '../../styles/inventory.css';
import '../../styles/interactive-modal.css';

export default function DeploymentHistory() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    deviceType: '',
    status: '',
    dateRange: '',
  });

  useEffect(() => {
    loadDeploymentHistory();
  }, [filters]);

  const loadDeploymentHistory = async () => {
    setLoading(true);
    try {
      const data = await getDeploymentHistory(filters);
      setDeployments(data);
    } catch (error) {
      console.error('Error loading deployment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSpecs = (deployment) => {
    setSelectedDeployment(deployment);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysDeployed = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_use: { color: '#0a0aa6', bg: '#dbeafe', text: 'Active' },
      returned: { color: '#059669', bg: '#d1fae5', text: 'Returned' },
    };
    
    const config = statusConfig[status] || { color: '#6b7280', bg: '#f3f4f6', text: status };
    
    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        {config.text}
      </span>
    );
  };

  const getDeviceTypeIcon = (type) => {
    return type === 'LAPTOP' ? <Package size={14} /> : <MonitorIcon size={14} />;
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading">Loading deployment history...</div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="header-title">
          <History size={32} className="header-icon" />
          <div>
            <h1>Deployment History</h1>
            <p className="subtitle">Complete history of device deployments and returns</p>
          </div>
        </div>
      </header>

      <div className="inventory-stats">
        <div className="stat-item">
          <span className="stat-label">Total Deployments</span>
          <span className="stat-value">{deployments.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value stat-issued">
            {deployments.filter(d => d.status === 'in_use').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Returned</span>
          <span className="stat-value stat-available">
            {deployments.filter(d => d.status === 'returned').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg. Days Used</span>
          <span className="stat-value">
            {deployments.length > 0 
              ? Math.round(deployments.reduce((sum, d) => 
                  sum + getDaysDeployed(d.date_issued, d.date_returned), 0) / deployments.length
                )
              : 0
            }
          </span>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <User size={18} />
          <input
            type="text"
            placeholder="Search by employee name or device ID..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="filters">
          <select
            value={filters.deviceType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, deviceType: e.target.value }))
            }
          >
            <option value="">All Device Types</option>
            <option value="LAPTOP">Laptops</option>
            <option value="DESKTOP">Desktops</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="in_use">Active</option>
            <option value="returned">Returned</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
            }
          >
            <option value="">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      <div className="inventory-table-card">
        {deployments.length === 0 ? (
          <div className="no-data-state">
            <History size={64} className="no-data-icon" />
            <h3>No Deployment History</h3>
            <p>No device deployments found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Device Type</th>
                  <th>Device ID</th>
                  <th>Date Deployed</th>
                  <th>Date Returned</th>
                  <th>Days Used</th>
                  <th>Status</th>
                  <th>Monitors</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((deployment) => {
                  const daysUsed = getDaysDeployed(deployment.date_issued, deployment.date_returned);
                  
                  return (
                    <tr key={deployment.employee_device_id}>
                      <td className="employee-cell">
                        <div>
                          <strong>{deployment.employees?.full_name || 'N/A'}</strong>
                          <br />
                          <small>{deployment.employees?.employee_code || 'N/A'}</small>
                          <br />
                          <small className="department-text">
                            {deployment.employees?.departments?.department_name || 'No Dept'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`device-type-badge ${deployment.device_type.toLowerCase()}`}>
                          {getDeviceTypeIcon(deployment.device_type)}
                          {deployment.device_type}
                        </span>
                      </td>
                      <td className="asset-id">{deployment.device_asset_id || deployment.device_id}</td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={14} />
                          {formatDate(deployment.date_issued)}
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          {deployment.date_returned ? (
                            <>
                              <Calendar size={14} />
                              {formatDate(deployment.date_returned)}
                            </>
                          ) : (
                            <span className="text-muted">Still deployed</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`days-badge ${daysUsed > 365 ? 'long-term' : ''}`}>
                          {daysUsed} days
                        </span>
                      </td>
                      <td>{getStatusBadge(deployment.status)}</td>
                      <td>
                        {deployment.employee_monitors?.length > 0 ? (
                          <span className="monitor-count">
                            <MonitorIcon size={14} />
                            {deployment.employee_monitors.length}
                          </span>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-icon btn-view"
                          onClick={() => handleViewSpecs(deployment)}
                          title="View Device Specifications"
                        >
                          <Eye size={16} />
                          View Specs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <InteractiveDeviceSpecModal
          deployment={selectedDeployment}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDeployment(null);
          }}
        />
      )}
    </div>
  );
}