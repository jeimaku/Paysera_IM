import { useState, useEffect } from 'react';
import { Users, Package, RotateCcw, Calendar, Monitor } from 'lucide-react';
import { getCurrentDeployments, returnDevice } from '../../services/deploymentService';
import '../../styles/inventory.css';

export default function EmployeeDevices() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);

  useEffect(() => {
    loadDeployments();
  }, []);

  const loadDeployments = async () => {
    setLoading(true);
    try {
      const data = await getCurrentDeployments();
      setDeployments(data);
    } catch (error) {
      console.error('Error loading deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnDevice = async (employeeDeviceId, employeeName, deviceInfo) => {
    if (!confirm(`Are you sure you want to return the device from ${employeeName}?\n\nDevice: ${deviceInfo}`)) {
      return;
    }

    setReturning(employeeDeviceId);
    try {
      const result = await returnDevice(employeeDeviceId);
      
      if (result.success) {
        alert('Device returned successfully!');
        loadDeployments(); // Refresh the list
      } else {
        alert('Failed to return device: ' + result.error);
      }
    } catch (error) {
      console.error('Return error:', error);
      alert('An error occurred while returning the device');
    } finally {
      setReturning(null);
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

  const getDeviceInfo = (deployment) => {
    // This would need to be enhanced to get actual device details
    return `${deployment.device_type} (ID: ${deployment.device_id})`;
  };

  const getMonitorsInfo = (deployment) => {
    if (!deployment.employee_monitors || deployment.employee_monitors.length === 0) {
      return 'None';
    }
    
    return deployment.employee_monitors.map(em => 
      `${em.monitors.asset_id} - ${em.monitors.brand} ${em.monitors.model}`
    ).join(', ');
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading">Loading device deployments...</div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="header-title">
          <Users size={32} className="header-icon" />
          <div>
            <h1>Employee Devices</h1>
            <p className="subtitle">View and manage current device deployments</p>
          </div>
        </div>
      </header>

      <div className="inventory-stats">
        <div className="stat-item">
          <span className="stat-label">Total Deployments</span>
          <span className="stat-value">{deployments.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Laptops Deployed</span>
          <span className="stat-value stat-issued">
            {deployments.filter(d => d.device_type === 'LAPTOP').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Desktops Deployed</span>
          <span className="stat-value stat-issued">
            {deployments.filter(d => d.device_type === 'DESKTOP').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Monitors Deployed</span>
          <span className="stat-value stat-available">
            {deployments.reduce((total, d) => total + (d.employee_monitors?.length || 0), 0)}
          </span>
        </div>
      </div>

      <div className="inventory-table-card">
        {deployments.length === 0 ? (
          <div className="no-data-state">
            <Package size={64} className="no-data-icon" />
            <h3>No Device Deployments</h3>
            <p>No devices are currently deployed to employees.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Device Type</th>
                  <th>Device ID</th>
                  <th>Monitors</th>
                  <th>Date Deployed</th>
                  <th>Days Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((deployment) => {
                  const daysActive = Math.floor(
                    (new Date() - new Date(deployment.date_issued)) / (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <tr key={deployment.employee_device_id}>
                      <td className="employee-name">
                        <div>
                          <strong>{deployment.employees?.full_name}</strong>
                          <br />
                          <small>{deployment.employees?.employee_code}</small>
                        </div>
                      </td>
                      <td>{deployment.employees?.departments?.department_name || 'N/A'}</td>
                      <td>
                        <span className={`device-type-badge ${deployment.device_type.toLowerCase()}`}>
                          {deployment.device_type === 'LAPTOP' ? (
                            <><Package size={14} /> Laptop</>
                          ) : (
                            <><Monitor size={14} /> Desktop</>
                          )}
                        </span>
                      </td>
                      <td className="asset-id">{deployment.device_id}</td>
                      <td className="monitors-cell">
                        {getMonitorsInfo(deployment)}
                      </td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={14} />
                          {formatDate(deployment.date_issued)}
                        </div>
                      </td>
                      <td>
                        <span className={`days-badge ${daysActive > 365 ? 'long-term' : ''}`}>
                          {daysActive} days
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-icon btn-return"
                          onClick={() => handleReturnDevice(
                            deployment.employee_device_id,
                            deployment.employees?.full_name,
                            getDeviceInfo(deployment)
                          )}
                          disabled={returning === deployment.employee_device_id}
                          title="Return Device"
                        >
                          {returning === deployment.employee_device_id ? (
                            'Returning...'
                          ) : (
                            <>
                              <RotateCcw size={16} />
                              Return
                            </>
                          )}
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
    </div>
  );
}