import { useState, useEffect } from 'react';
import { X, Laptop, Monitor as MonitorIcon, HardDrive, Cpu, Calendar, User, Package, Info, Award, Clock } from 'lucide-react';
import { getDetailedDeviceSpecs } from '../../services/deploymentService';

export default function DeviceSpecModal({ deployment, onClose }) {
  const [deviceSpecs, setDeviceSpecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deployment');

  useEffect(() => {
    if (deployment) {
      loadDeviceSpecs();
    }
  }, [deployment]);

  const loadDeviceSpecs = async () => {
    setLoading(true);
    try {
      const specs = await getDetailedDeviceSpecs(
        deployment.device_type,
        deployment.device_id
      );
      setDeviceSpecs(specs);
    } catch (error) {
      console.error('Error loading device specifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatStorage = (sizeGB, type) => {
    if (!sizeGB) return 'N/A';
    const formatted = sizeGB >= 1000 
      ? `${(sizeGB / 1000).toFixed(1)} TB`
      : `${sizeGB} GB`;
    return type ? `${formatted} ${type}` : formatted;
  };

  const formatMemory = (sizeGB) => {
    if (!sizeGB) return 'N/A';
    return `${sizeGB} GB`;
  };

  const getDaysUsed = () => {
    return Math.floor(
      (new Date(deployment.date_returned || new Date()) - 
       new Date(deployment.date_issued)) / (1000 * 60 * 60 * 24)
    );
  };

  const getStatusColor = (status) => {
    return status === 'in_use' ? '#0a0aa6' : '#059669';
  };

  const getWarrantyStatus = (warrantyEnd) => {
    if (!warrantyEnd) return { status: 'Unknown', color: '#6b7280', icon: '❓' };
    
    const endDate = new Date(warrantyEnd);
    const today = new Date();
    const daysLeft = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'Expired', color: '#dc2626', icon: '❌' };
    if (daysLeft < 90) return { status: `${daysLeft} days left`, color: '#ea580c', icon: '⚠️' };
    return { status: 'Active', color: '#059669', icon: '✅' };
  };

  if (!deployment) return null;

  const warranty = deviceSpecs?.warranty_end ? getWarrantyStatus(deviceSpecs.warranty_end) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="interactive-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header with Device Info */}
        <div className="interactive-modal-header">
          <div className="device-header-info">
            <div className="device-icon">
              {deployment.device_type === 'LAPTOP' ? (
                <Laptop size={32} className="device-icon-svg" />
              ) : (
                <HardDrive size={32} className="device-icon-svg" />
              )}
            </div>
            <div className="device-title">
              <h2>{deviceSpecs?.brand || 'Device'} {deviceSpecs?.model || deployment.device_type}</h2>
              <p className="device-subtitle">
                Asset ID: <span className="asset-id-badge">{deviceSpecs?.asset_id || deployment.device_id}</span>
              </p>
              <div className="device-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(deployment.status) }}
                />
                {deployment.status === 'in_use' ? 'Currently Active' : 'Returned'}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'deployment' ? 'active' : ''}`}
            onClick={() => setActiveTab('deployment')}
          >
            <User size={16} />
            Deployment
          </button>
          <button
            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            <Package size={16} />
            Specifications
          </button>
          {deployment.employee_monitors && deployment.employee_monitors.length > 0 && (
            <button
              className={`tab-btn ${activeTab === 'monitors' ? 'active' : ''}`}
              onClick={() => setActiveTab('monitors')}
            >
              <MonitorIcon size={16} />
              Monitors ({deployment.employee_monitors.length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="interactive-modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner-modern"></div>
              <p>Loading device specifications...</p>
            </div>
          ) : (
            <>
              {/* Deployment Tab */}
              {activeTab === 'deployment' && (
                <div className="tab-content">
                  <div className="info-cards-grid">
                    <div className="info-card employee-card">
                      <div className="card-header">
                        <User size={20} />
                        <h3>Employee Information</h3>
                      </div>
                      <div className="employee-details">
                        <div className="employee-avatar">
                          {deployment.employees?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="employee-info">
                          <h4>{deployment.employees?.full_name || 'Unknown'}</h4>
                          <p className="employee-code">{deployment.employees?.employee_code || 'N/A'}</p>
                          <p className="employee-dept">{deployment.employees?.departments?.department_name || 'No Department'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="info-card timeline-card">
                      <div className="card-header">
                        <Clock size={20} />
                        <h3>Deployment Timeline</h3>
                      </div>
                      <div className="timeline">
                        <div className="timeline-item">
                          <div className="timeline-dot deployed"></div>
                          <div className="timeline-content">
                            <strong>Deployed</strong>
                            <p>{formatDate(deployment.date_issued)}</p>
                          </div>
                        </div>
                        {deployment.date_returned ? (
                          <div className="timeline-item">
                            <div className="timeline-dot returned"></div>
                            <div className="timeline-content">
                              <strong>Returned</strong>
                              <p>{formatDate(deployment.date_returned)}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="timeline-item">
                            <div className="timeline-dot active"></div>
                            <div className="timeline-content">
                              <strong>Still Active</strong>
                              <p>{getDaysUsed()} days in use</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="info-card stats-card">
                      <div className="card-header">
                        <Info size={20} />
                        <h3>Usage Statistics</h3>
                      </div>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="stat-value">{getDaysUsed()}</span>
                          <span className="stat-label">Days Used</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{deployment.employee_monitors?.length || 0}</span>
                          <span className="stat-label">Monitors</span>
                        </div>
                        <div className="stat-item">
                          <span className={`stat-value ${deployment.status === 'in_use' ? 'active' : 'returned'}`}>
                            {deployment.status === 'in_use' ? 'Active' : 'Returned'}
                          </span>
                          <span className="stat-label">Status</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && deviceSpecs && (
                <div className="tab-content">
                  <div className="specs-container">
                    {/* Quick Overview */}
                    <div className="specs-overview">
                      <div className="overview-item">
                        <Cpu size={16} />
                        <span>{deviceSpecs.cpu || deviceSpecs.processor || 'Unknown CPU'}</span>
                      </div>
                      <div className="overview-item">
                        <HardDrive size={16} />
                        <span>{formatMemory(deviceSpecs.memory || (deviceSpecs.memory_modules?.reduce((sum, m) => sum + (m.size_gb || 0), 0)))}</span>
                      </div>
                      <div className="overview-item">
                        <HardDrive size={16} />
                        <span>{formatStorage(deviceSpecs.storage || (deviceSpecs.storage_devices?.reduce((sum, s) => sum + (s.capacity_gb || 0), 0)))}</span>
                      </div>
                    </div>

                    {/* Detailed Specs */}
                    <div className="specs-sections">
                      {deployment.device_type === 'LAPTOP' ? (
                        <div className="specs-section">
                          <h4>Laptop Specifications</h4>
                          <div className="specs-grid">
                            <div className="spec-row">
                              <label>Brand & Model</label>
                              <span>{deviceSpecs.brand} {deviceSpecs.model}</span>
                            </div>
                            <div className="spec-row">
                              <label>Serial Number</label>
                              <span className="mono">{deviceSpecs.serial_number || 'N/A'}</span>
                            </div>
                            <div className="spec-row">
                              <label>Operating System</label>
                              <span>{deviceSpecs.operating_system || 'N/A'}</span>
                            </div>
                            <div className="spec-row">
                              <label>Processor</label>
                              <span>{deviceSpecs.cpu || 'N/A'}</span>
                            </div>
                            <div className="spec-row">
                              <label>Memory</label>
                              <span className="memory-value">{formatMemory(deviceSpecs.memory)}</span>
                            </div>
                            <div className="spec-row">
                              <label>Storage</label>
                              <span className="storage-value">{formatStorage(deviceSpecs.storage, deviceSpecs.storage_type)}</span>
                            </div>
                            {warranty && (
                              <div className="spec-row warranty-row">
                                <label>Warranty</label>
                                <span className="warranty-status" style={{ color: warranty.color }}>
                                  {warranty.icon} {warranty.status}
                                </span>
                              </div>
                            )}
                            <div className="spec-row">
                              <label>Distributor</label>
                              <span>{deviceSpecs.distributor || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="specs-section">
                          <h4>Desktop Specifications</h4>
                          <div className="specs-grid">
                            <div className="spec-row">
                              <label>Operating System</label>
                              <span>{deviceSpecs.operating_system || 'N/A'}</span>
                            </div>
                            <div className="spec-row">
                              <label>Processor</label>
                              <span>{deviceSpecs.processor || 'N/A'}</span>
                            </div>
                          </div>

                          {/* Memory Modules */}
                          {deviceSpecs.memory_modules && deviceSpecs.memory_modules.length > 0 && (
                            <div className="component-section">
                              <h5>Memory Configuration</h5>
                              <div className="memory-slots">
                                {deviceSpecs.memory_modules.map((module, index) => (
                                  <div key={index} className="memory-slot">
                                    <div className="slot-header">Slot {module.slot_number}</div>
                                    <div className="slot-capacity">{formatMemory(module.size_gb)}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="total-summary">
                                Total Memory: <strong>{formatMemory(
                                  deviceSpecs.memory_modules.reduce((sum, m) => sum + (m.size_gb || 0), 0)
                                )}</strong>
                              </div>
                            </div>
                          )}

                          {/* Storage Devices */}
                          {deviceSpecs.storage_devices && deviceSpecs.storage_devices.length > 0 && (
                            <div className="component-section">
                              <h5>Storage Configuration</h5>
                              <div className="storage-devices-list">
                                {deviceSpecs.storage_devices.map((storage, index) => (
                                  <div key={index} className="storage-device-item">
                                    <div className="storage-type">{storage.storage_type}</div>
                                    <div className="storage-capacity">{formatStorage(storage.capacity_gb)}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="total-summary">
                                Total Storage: <strong>{formatStorage(
                                  deviceSpecs.storage_devices.reduce((sum, s) => sum + (s.capacity_gb || 0), 0)
                                )}</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Monitors Tab */}
              {activeTab === 'monitors' && deployment.employee_monitors && deployment.employee_monitors.length > 0 && (
                <div className="tab-content">
                  <div className="monitors-container">
                    <div className="monitors-grid-interactive">
                      {deployment.employee_monitors.map((monitor, index) => (
                        <div key={index} className="monitor-card-interactive">
                          <div className="monitor-visual">
                            <MonitorIcon size={32} />
                            <span className="monitor-number">{index + 1}</span>
                          </div>
                          <div className="monitor-info">
                            <h4>{monitor.monitors?.brand} {monitor.monitors?.model}</h4>
                            <div className="monitor-specs">
                              <div className="monitor-spec">
                                <label>Asset ID</label>
                                <span className="mono">{monitor.monitors?.asset_id}</span>
                              </div>
                              <div className="monitor-spec">
                                <label>Model Code</label>
                                <span>{monitor.monitors?.model_code || 'N/A'}</span>
                              </div>
                              <div className="monitor-spec">
                                <label>Serial Number</label>
                                <span className="mono">{monitor.monitors?.serial_number || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="interactive-modal-footer">
          <button className="btn-close-modern" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}