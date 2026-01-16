import { useState, useEffect } from 'react';
import { 
  Users, 
  Laptop, 
  HardDrive, 
  Monitor, 
  Search, 
  Eye, 
  User, 
  Calendar,
  Cpu,
  HardDrive as Storage,
  MemoryStick,
  Shield,
  X,
  ExternalLink
} from 'lucide-react';
import '../../styles/employee-device.css';

// Mock data service - replace with actual API calls
const getEmployeeDevices = async (filters = {}) => {
  // This would be your actual API call
  return [
    {
      id: 1,
      employee: {
        name: "John Smith",
        email: "john.smith@company.com",
        department: "Engineering",
        position: "Senior Developer"
      },
      devices: [
        {
          id: "LP-001",
          type: "laptop",
          brand: "LENOVO",
          model: "ThinkPad X1",
          operating_system: "Windows 11",
          cpu: "Intel Core i7-12700H",
          memory: 32,
          storage: 1024,
          storage_type: "SSD",
          serial_number: "PF123456",
          warranty_end: "2025-06-15",
          status: "issued",
          assigned_date: "2024-01-15"
        }
      ]
    },
    {
      id: 2,
      employee: {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        department: "Design",
        position: "UI/UX Designer"
      },
      devices: [
        {
          id: "LP-002",
          type: "laptop",
          brand: "Apple",
          model: "MacBook Pro",
          operating_system: "macOS Sonoma",
          cpu: "Apple M3 Pro",
          memory: 18,
          storage: 512,
          storage_type: "SSD",
          serial_number: "MBP789012",
          warranty_end: "2025-09-20",
          status: "issued",
          assigned_date: "2024-03-10"
        },
        {
          id: "MN-001",
          type: "monitor",
          brand: "Dell",
          model: "UltraSharp U2723QE",
          model_code: "U2723QE-BLK",
          serial_number: "DL345678",
          status: "issued",
          assigned_date: "2024-03-10"
        }
      ]
    },
    {
      id: 3,
      employee: {
        name: "Mike Chen",
        email: "mike.chen@company.com",
        department: "Data Science",
        position: "Data Analyst"
      },
      devices: [
        {
          id: "DT-001",
          type: "desktop",
          operating_system: "Ubuntu 22.04",
          processor: "AMD Ryzen 9 7900X",
          desktop_memory: [
            { slot_number: 1, size_gb: 16 },
            { slot_number: 2, size_gb: 16 }
          ],
          desktop_storage: [
            { capacity_gb: 1000, storage_type: "NVMe SSD" },
            { capacity_gb: 2000, storage_type: "SATA SSD" }
          ],
          status: "issued",
          assigned_date: "2024-02-01"
        }
      ]
    }
  ];
};

export default function EmployeeDevicesPage() {
  const [employeeDevices, setEmployeeDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    deviceType: ''
  });

  useEffect(() => {
    loadEmployeeDevices();
  }, [filters]);

  const loadEmployeeDevices = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeDevices(filters);
      setEmployeeDevices(data);
    } catch (error) {
      console.error('Error loading employee devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDevice = (device, employee) => {
    setSelectedDevice({ ...device, employee });
    setModalOpen(true);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'laptop':
        return <Laptop size={20} />;
      case 'desktop':
        return <HardDrive size={20} />;
      case 'monitor':
        return <Monitor size={20} />;
      default:
        return <HardDrive size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'issued':
        return '#0a0aa6';
      case 'available':
        return '#10b981';
      case 'defective':
        return '#ef4444';
      default:
        return '#6b7280';
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

  const calculateTotalRAM = (device) => {
    if (device.memory) return `${device.memory} GB`;
    if (device.desktop_memory && device.desktop_memory.length > 0) {
      const total = device.desktop_memory.reduce((sum, mem) => sum + mem.size_gb, 0);
      return `${total} GB`;
    }
    return 'N/A';
  };

  const calculateTotalStorage = (device) => {
    if (device.storage) return `${device.storage} GB`;
    if (device.desktop_storage && device.desktop_storage.length > 0) {
      const total = device.desktop_storage.reduce((sum, stor) => sum + stor.capacity_gb, 0);
      return total >= 1000 ? `${(total / 1000).toFixed(1)} TB` : `${total} GB`;
    }
    return 'N/A';
  };

  const totalDevices = employeeDevices.reduce((total, emp) => total + emp.devices.length, 0);
  const departments = [...new Set(employeeDevices.map(emp => emp.employee.department))];

  return (
    <div className="inventory-container">
      {/* Enhanced Header */}
      <header className="inventory-header-improved admin">
        <div className="header-content-improved">
          <div className="header-title-improved">
            <div className="header-icon-improved admin">
              <Users size={32} />
            </div>
            <div className="header-text-improved">
              <h1>Employee Devices</h1>
              <p className="subtitle-improved">View and manage devices assigned to employees</p>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Statistics */}
      <div className="inventory-stats-improved">
        <div className="stat-card-improved primary admin">
          <div className="stat-icon-improved">
            <Users size={20} />
          </div>
          <div className="stat-content-improved">
            <span className="stat-value-improved">{employeeDevices.length}</span>
            <span className="stat-label-improved">Total Employees</span>
          </div>
        </div>
        <div className="stat-card-improved available">
          <div className="stat-content-improved">
            <span className="stat-value-improved">{totalDevices}</span>
            <span className="stat-label-improved">Assigned Devices</span>
          </div>
        </div>
        <div className="stat-card-improved issued">
          <div className="stat-content-improved">
            <span className="stat-value-improved">
              {employeeDevices.reduce((total, emp) => 
                total + emp.devices.filter(d => d.type === 'laptop').length, 0
              )}
            </span>
            <span className="stat-label-improved">Laptops</span>
          </div>
        </div>
        <div className="stat-card-improved defective">
          <div className="stat-content-improved">
            <span className="stat-value-improved">
              {employeeDevices.reduce((total, emp) => 
                total + emp.devices.filter(d => d.type === 'desktop').length, 0
              )}
            </span>
            <span className="stat-label-improved">Desktops</span>
          </div>
        </div>
        <div className="stat-card-improved warning">
          <div className="stat-content-improved">
            <span className="stat-value-improved">{departments.length}</span>
            <span className="stat-label-improved">Departments</span>
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="inventory-controls-improved admin">
        <div className="search-section-improved">
          <div className="search-box-improved">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by employee name, email, or device..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="filters-improved admin">
          <select
            className="filter-select-improved"
            value={filters.department}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, department: e.target.value }))
            }
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            className="filter-select-improved"
            value={filters.deviceType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, deviceType: e.target.value }))
            }
          >
            <option value="">All Device Types</option>
            <option value="laptop">Laptops</option>
            <option value="desktop">Desktops</option>
            <option value="monitor">Monitors</option>
          </select>
        </div>
      </div>

      {/* Employee Devices Cards */}
      <div className="employee-devices-grid">
        {loading ? (
          <div className="loading-improved">
            <div className="loading-spinner-improved"></div>
            <span>Loading employee devices...</span>
          </div>
        ) : employeeDevices.length === 0 ? (
          <div className="no-data-state-improved">
            <Users size={64} className="no-data-icon-improved" />
            <h3>No Employee Devices Found</h3>
            <p>No employees with assigned devices match your current search criteria.</p>
          </div>
        ) : (
          employeeDevices.map((empData) => (
            <div key={empData.id} className="employee-card">
              {/* Employee Header */}
              <div className="employee-header">
                <div className="employee-info">
                  <div className="employee-avatar">
                    <User size={24} />
                  </div>
                  <div className="employee-details">
                    <h3 className="employee-name">{empData.employee.name}</h3>
                    <p className="employee-email">{empData.employee.email}</p>
                    <div className="employee-meta">
                      <span className="department-badge">{empData.employee.department}</span>
                      <span className="position-text">{empData.employee.position}</span>
                    </div>
                  </div>
                </div>
                <div className="device-count-badge">
                  {empData.devices.length} Device{empData.devices.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Devices List */}
              <div className="devices-list">
                {empData.devices.map((device) => (
                  <div key={device.id} className="device-item">
                    <div className="device-summary">
                      <div className="device-icon">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div className="device-basic-info">
                        <div className="device-id-name">
                          <span className="device-asset-id">{device.id}</span>
                          <span className="device-brand-model">
                            {device.brand ? `${device.brand} ${device.model}` : 
                             device.processor ? `Custom Desktop` : 
                             `${device.model || 'Device'}`}
                          </span>
                        </div>
                        <div className="device-quick-specs">
                          {device.operating_system && (
                            <span className="spec-badge os">{device.operating_system}</span>
                          )}
                          <span className="spec-badge ram">{calculateTotalRAM(device)}</span>
                          <span className="spec-badge storage">{calculateTotalStorage(device)}</span>
                        </div>
                      </div>
                      <div className="device-status">
                        <span
                          className="status-indicator"
                          style={{
                            backgroundColor: `${getStatusColor(device.status)}15`,
                            color: getStatusColor(device.status),
                            borderColor: getStatusColor(device.status)
                          }}
                        >
                          {device.status}
                        </span>
                        <span className="assigned-date">
                          {formatDate(device.assigned_date)}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDevice(device, empData.employee)}
                      title="View Details"
                    >
                      <Eye size={16} />
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Device Details Modal */}
      {modalOpen && selectedDevice && (
        <div className="device-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="device-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="device-modal-icon">
                  {getDeviceIcon(selectedDevice.type)}
                </div>
                <div>
                  <h2>Device Details</h2>
                  <p className="device-asset-id-modal">{selectedDevice.id}</p>
                </div>
              </div>
              <button 
                className="close-modal-btn"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {/* Employee Section */}
              <div className="modal-section">
                <h3><User size={18} /> Assigned To</h3>
                <div className="employee-card-modal">
                  <div className="employee-info-modal">
                    <div className="employee-name-modal">{selectedDevice.employee.name}</div>
                    <div className="employee-email-modal">{selectedDevice.employee.email}</div>
                    <div className="employee-details-modal">
                      <span className="department-badge-modal">{selectedDevice.employee.department}</span>
                      <span className="position-modal">{selectedDevice.employee.position}</span>
                    </div>
                  </div>
                  <div className="assignment-info">
                    <div className="assignment-date">
                      <Calendar size={16} />
                      <span>Assigned: {formatDate(selectedDevice.assigned_date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div className="modal-section">
                <h3>{getDeviceIcon(selectedDevice.type)} Device Information</h3>
                <div className="device-specs-grid">
                  <div className="spec-card">
                    <div className="spec-label">Asset ID</div>
                    <div className="spec-value primary">{selectedDevice.id}</div>
                  </div>
                  
                  {selectedDevice.brand && (
                    <div className="spec-card">
                      <div className="spec-label">Brand & Model</div>
                      <div className="spec-value">{selectedDevice.brand} {selectedDevice.model}</div>
                    </div>
                  )}

                  {selectedDevice.serial_number && (
                    <div className="spec-card">
                      <div className="spec-label">Serial Number</div>
                      <div className="spec-value mono">{selectedDevice.serial_number}</div>
                    </div>
                  )}

                  <div className="spec-card">
                    <div className="spec-label">Status</div>
                    <div className="spec-value">
                      <span
                        className="status-badge-modal"
                        style={{
                          backgroundColor: `${getStatusColor(selectedDevice.status)}15`,
                          color: getStatusColor(selectedDevice.status),
                          borderColor: getStatusColor(selectedDevice.status)
                        }}
                      >
                        {selectedDevice.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="modal-section">
                <h3><Cpu size={18} /> Technical Specifications</h3>
                <div className="tech-specs-grid">
                  {selectedDevice.operating_system && (
                    <div className="tech-spec-card">
                      <div className="tech-spec-header">
                        <div className="tech-spec-icon">💿</div>
                        <div className="tech-spec-label">Operating System</div>
                      </div>
                      <div className="tech-spec-value">{selectedDevice.operating_system}</div>
                    </div>
                  )}

                  {(selectedDevice.cpu || selectedDevice.processor) && (
                    <div className="tech-spec-card">
                      <div className="tech-spec-header">
                        <Cpu size={16} />
                        <div className="tech-spec-label">Processor</div>
                      </div>
                      <div className="tech-spec-value">{selectedDevice.cpu || selectedDevice.processor}</div>
                    </div>
                  )}

                  {(selectedDevice.memory || selectedDevice.desktop_memory) && (
                    <div className="tech-spec-card">
                      <div className="tech-spec-header">
                        <MemoryStick size={16} />
                        <div className="tech-spec-label">Memory</div>
                      </div>
                      <div className="tech-spec-value">
                        {calculateTotalRAM(selectedDevice)}
                        {selectedDevice.desktop_memory && selectedDevice.desktop_memory.length > 0 && (
                          <div className="memory-breakdown">
                            {selectedDevice.desktop_memory.map((mem, idx) => (
                              <div key={idx} className="memory-module">
                                Slot {mem.slot_number}: {mem.size_gb}GB
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(selectedDevice.storage || selectedDevice.desktop_storage) && (
                    <div className="tech-spec-card">
                      <div className="tech-spec-header">
                        <Storage size={16} />
                        <div className="tech-spec-label">Storage</div>
                      </div>
                      <div className="tech-spec-value">
                        {calculateTotalStorage(selectedDevice)}
                        {selectedDevice.storage_type && (
                          <div className="storage-type">{selectedDevice.storage_type}</div>
                        )}
                        {selectedDevice.desktop_storage && selectedDevice.desktop_storage.length > 0 && (
                          <div className="storage-breakdown">
                            {selectedDevice.desktop_storage.map((stor, idx) => (
                              <div key={idx} className="storage-device">
                                {stor.capacity_gb}GB {stor.storage_type}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Warranty & Service */}
              {selectedDevice.warranty_end && (
                <div className="modal-section">
                  <h3><Shield size={18} /> Warranty & Service</h3>
                  <div className="warranty-info-modal">
                    <div className="warranty-card-modal">
                      <div className="warranty-label">Warranty Expires</div>
                      <div className="warranty-date-modal">{formatDate(selectedDevice.warranty_end)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary-improved"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
              <button className="btn-primary-improved">
                <ExternalLink size={16} />
                Edit Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}