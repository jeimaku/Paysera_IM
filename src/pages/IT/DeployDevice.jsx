import { useState, useEffect } from 'react';
import { Package, User, Laptop, Monitor, Check } from 'lucide-react';
import {
  getEmployeesForDeployment,
  getAvailableDevices,
  getAvailableMonitors,
  deployDevice
} from '../../services/deploymentService';
import '../../styles/deployment.css';

export default function DeployDevice() {
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  const [deploymentForm, setDeploymentForm] = useState({
    employeeId: '',
    deviceType: 'LAPTOP',
    deviceId: '',
    monitorIds: []
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (deploymentForm.deviceType) {
      loadDevices();
    }
  }, [deploymentForm.deviceType]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [employeesData, monitorsData] = await Promise.all([
        getEmployeesForDeployment(),
        getAvailableMonitors()
      ]);
      setEmployees(employeesData);
      setMonitors(monitorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      const devicesData = await getAvailableDevices(deploymentForm.deviceType);
      setDevices(devicesData);
      // Reset device selection when changing type
      setDeploymentForm(prev => ({ ...prev, deviceId: '' }));
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const handleFormChange = (field, value) => {
    setDeploymentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMonitorToggle = (monitorId) => {
    setDeploymentForm(prev => ({
      ...prev,
      monitorIds: prev.monitorIds.includes(monitorId)
        ? prev.monitorIds.filter(id => id !== monitorId)
        : [...prev.monitorIds, monitorId]
    }));
  };

  const handleDeploy = async () => {
    if (!deploymentForm.employeeId || !deploymentForm.deviceId) {
      alert('Please select both an employee and a device');
      return;
    }

    setDeploying(true);
    try {
      const result = await deployDevice(deploymentForm);
      
      if (result.success) {
        alert('Device deployed successfully!');
        // Reset form
        setDeploymentForm({
          employeeId: '',
          deviceType: 'LAPTOP',
          deviceId: '',
          monitorIds: []
        });
        // Reload data
        loadInitialData();
        loadDevices();
      } else {
        alert('Failed to deploy device: ' + result.error);
      }
    } catch (error) {
      console.error('Deployment error:', error);
      alert('An error occurred during deployment');
    } finally {
      setDeploying(false);
    }
  };

  const selectedEmployee = employees.find(emp => emp.employee_id === deploymentForm.employeeId);
  const selectedDevice = devices.find(device => device.device_id === deploymentForm.deviceId);

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading">Loading deployment data...</div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="header-title">
          <Package size={32} className="header-icon" />
          <div>
            <h1>Deploy Device</h1>
            <p className="subtitle">Assign devices to employees</p>
          </div>
        </div>
      </header>

      <div className="deployment-form-card">
        <div className="deployment-steps">
          
          {/* Step 1: Select Employee */}
          <div className="deployment-step">
            <div className="step-header">
              <User size={20} />
              <h3>Step 1: Select Employee</h3>
            </div>
            <select 
              value={deploymentForm.employeeId}
              onChange={(e) => handleFormChange('employeeId', e.target.value)}
              className="form-select"
            >
              <option value="">Choose an employee...</option>
              {employees.map(employee => (
                <option key={employee.employee_id} value={employee.employee_id}>
                  {employee.full_name} ({employee.employee_code}) - {employee.departments?.department_name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Device Type */}
          <div className="deployment-step">
            <div className="step-header">
              <Laptop size={20} />
              <h3>Step 2: Select Device Type</h3>
            </div>
            <div className="device-type-options">
              <label className="device-type-option">
                <input 
                  type="radio" 
                  value="LAPTOP" 
                  checked={deploymentForm.deviceType === 'LAPTOP'}
                  onChange={(e) => handleFormChange('deviceType', e.target.value)}
                />
                <span>Laptop</span>
              </label>
              <label className="device-type-option">
                <input 
                  type="radio" 
                  value="DESKTOP" 
                  checked={deploymentForm.deviceType === 'DESKTOP'}
                  onChange={(e) => handleFormChange('deviceType', e.target.value)}
                />
                <span>Desktop</span>
              </label>
            </div>
          </div>

          {/* Step 3: Select Device */}
          <div className="deployment-step">
            <div className="step-header">
              <Package size={20} />
              <h3>Step 3: Select Device</h3>
            </div>
            <select 
              value={deploymentForm.deviceId}
              onChange={(e) => handleFormChange('deviceId', e.target.value)}
              className="form-select"
              disabled={!deploymentForm.deviceType}
            >
              <option value="">Choose a {deploymentForm.deviceType.toLowerCase()}...</option>
              {devices.map(device => (
                <option key={device.device_id} value={device.device_id}>
                  {device.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 4: Select Monitors (Optional) */}
          <div className="deployment-step">
            <div className="step-header">
              <Monitor size={20} />
              <h3>Step 4: Select Monitors (Optional)</h3>
            </div>
            <div className="monitors-grid">
              {monitors.length === 0 ? (
                <p className="no-data">No available monitors</p>
              ) : (
                monitors.map(monitor => (
                  <label key={monitor.monitor_id} className="monitor-option">
                    <input 
                      type="checkbox"
                      checked={deploymentForm.monitorIds.includes(monitor.monitor_id)}
                      onChange={() => handleMonitorToggle(monitor.monitor_id)}
                    />
                    <span>{monitor.asset_id} - {monitor.brand} {monitor.model}</span>
                  </label>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Deployment Summary */}
        {(selectedEmployee || selectedDevice || deploymentForm.monitorIds.length > 0) && (
          <div className="deployment-summary">
            <h3>Deployment Summary</h3>
            <div className="summary-details">
              {selectedEmployee && (
                <div className="summary-item">
                  <strong>Employee:</strong> {selectedEmployee.full_name} ({selectedEmployee.employee_code})
                </div>
              )}
              {selectedDevice && (
                <div className="summary-item">
                  <strong>Device:</strong> {selectedDevice.display_name}
                </div>
              )}
              {deploymentForm.monitorIds.length > 0 && (
                <div className="summary-item">
                  <strong>Monitors:</strong> {deploymentForm.monitorIds.length} selected
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deploy Button */}
        <div className="deployment-actions">
          <button 
            className="btn-primary btn-deploy"
            onClick={handleDeploy}
            disabled={!deploymentForm.employeeId || !deploymentForm.deviceId || deploying}
          >
            {deploying ? (
              'Deploying...'
            ) : (
              <>
                <Check size={18} />
                Deploy Device
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}