import { useState, useEffect } from 'react';
import { Search, HardDrive, Eye, Shield } from 'lucide-react';
import { getDesktops } from '../../services/deviceService';
import '../../styles/read-only-inventory.css';

export default function DesktopInventory() {
  const [desktops, setDesktops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  useEffect(() => {
    loadDesktops();
  }, [filters]);

  const loadDesktops = async () => {
    setLoading(true);
    try {
      const data = await getDesktops(filters);
      setDesktops(data);
    } catch (error) {
      console.error('Error loading desktops:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return '#10b981';
      case 'issued':
        return '#0a0aa6';
      case 'defective':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const calculateTotalRAM = (desktop) => {
    if (!desktop.desktop_memory || desktop.desktop_memory.length === 0) {
      return { total: 'N/A', slots: 0 };
    }
    const total = desktop.desktop_memory.reduce(
      (sum, mem) => sum + (mem.size_gb || 0),
      0
    );
    return { total: `${total} GB`, slots: desktop.desktop_memory.length };
  };

  const calculateTotalStorage = (desktop) => {
    if (!desktop.desktop_storage || desktop.desktop_storage.length === 0) {
      return { total: 'N/A', devices: 0 };
    }
    const total = desktop.desktop_storage.reduce(
      (sum, stor) => sum + (stor.capacity_gb || 0),
      0
    );
    const totalFormatted = total >= 1000 ? `${(total / 1000).toFixed(1)} TB` : `${total} GB`;
    return { total: totalFormatted, devices: desktop.desktop_storage.length };
  };

  const getStorageTypes = (desktop) => {
    if (!desktop.desktop_storage || desktop.desktop_storage.length === 0) {
      return 'N/A';
    }
    const types = desktop.desktop_storage.map((s) => s.storage_type);
    return [...new Set(types)].join(', ');
  };

  return (
    <div className="inventory-container">
      <header className="inventory-header-improved">
        <div className="header-content-improved">
          <div className="header-title-improved">
            <div className="header-icon-improved">
              <HardDrive size={32} />
            </div>
            <div className="header-text-improved">
              <h1>Desktop Inventory</h1>
              <p className="subtitle-improved">View desktop PCs and system configurations (Read-only)</p>
            </div>
          </div>
          <div className="header-badge-improved">
            <Shield size={16} />
            <span>IT Read-Only Access</span>
          </div>
        </div>
      </header>

      <div className="inventory-stats-improved">
        <div className="stat-card-improved primary">
          <div className="stat-icon-improved">
            <HardDrive size={20} />
          </div>
          <div className="stat-content-improved">
            <span className="stat-value-improved">{desktops.length}</span>
            <span className="stat-label-improved">Total Desktops</span>
          </div>
        </div>
        <div className="stat-card-improved available">
          <div className="stat-content-improved">
            <span className="stat-value-improved">{desktops.filter((d) => d.status === 'available').length}</span>
            <span className="stat-label-improved">Available</span>
          </div>
        </div>
        <div className="stat-card-improved issued">
          <div className="stat-content-improved">
            <span className="stat-value-improved">{desktops.filter((d) => d.status === 'issued').length}</span>
            <span className="stat-label-improved">Issued</span>
          </div>
        </div>
        <div className="stat-card-improved defective">
          <div className="stat-content-improved">
            <span className="stat-value-improved">{desktops.filter((d) => d.status === 'defective').length}</span>
            <span className="stat-label-improved">Defective</span>
          </div>
        </div>
        {/* <div className="stat-card-improved warning">
          <div className="stat-content-improved">
            <span className="stat-value-improved">
              {desktops.reduce((total, desktop) => {
                const ramInfo = calculateTotalRAM(desktop);
                const ramValue = ramInfo.total === 'N/A' ? 0 : parseInt(ramInfo.total);
                return total + ramValue;
              }, 0)} GB
            </span>
            <span className="stat-label-improved">Total Fleet RAM</span>
          </div>
        </div> */}
      </div>

      <div className="inventory-controls-improved">
        <div className="search-section-improved">
          <div className="search-box-improved">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by asset ID, processor, or operating system..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="filters-improved">
          <select
            className="filter-select-improved"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="defective">Defective</option>
          </select>

          <div className="access-notice-improved">
            <Eye size={16} />
            <span>Read-only access for IT users</span>
          </div>
        </div>
      </div>

      <div className="inventory-table-improved">
        {loading ? (
          <div className="loading-improved">
            <div className="loading-spinner-improved"></div>
            <span>Loading desktops...</span>
          </div>
        ) : desktops.length === 0 ? (
          <div className="no-data-state-improved">
            <HardDrive size={64} className="no-data-icon-improved" />
            <h3>No Desktops Found</h3>
            <p>No desktop computers match your current search criteria.</p>
          </div>
        ) : (
          <div className="table-container-improved">
            <table className="data-table-improved">
              <thead>
                <tr>
                  <th className="col-asset">Asset ID</th>
                  <th className="col-os">Operating System</th>
                  <th className="col-cpu">Processor</th>
                  <th className="col-ram">Memory Configuration</th>
                  <th className="col-storage">Total Storage</th>
                  <th className="col-storage-types">Storage Types</th>
                  <th className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {desktops.map((desktop) => {
                  const ramInfo = calculateTotalRAM(desktop);
                  const storageInfo = calculateTotalStorage(desktop);
                  
                  return (
                    <tr key={desktop.desktop_id} className="table-row-improved">
                      <td className="asset-cell-improved">
                        <span className="asset-id-improved">{desktop.asset_id}</span>
                      </td>
                      <td className="os-cell-improved">
                        <span className="os-badge-improved">
                          {desktop.operating_system || 'N/A'}
                        </span>
                      </td>
                      <td className="cpu-cell-improved">
                        <span className="cpu-text-improved" title={desktop.processor}>
                          {desktop.processor || 'N/A'}
                        </span>
                      </td>
                      <td className="ram-cell-improved">
                        <div className="memory-info-improved">
                          <div className="memory-total-improved">{ramInfo.total}</div>
                          {ramInfo.slots > 0 && (
                            <small className="memory-details-improved">
                              {ramInfo.slots} module{ramInfo.slots > 1 ? 's' : ''}
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="storage-cell-improved">
                        <div className="storage-info-improved">
                          <div className="storage-total-improved">{storageInfo.total}</div>
                          {storageInfo.devices > 0 && (
                            <small className="storage-details-improved">
                              {storageInfo.devices} device{storageInfo.devices > 1 ? 's' : ''}
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="storage-types-cell-improved">
                        <span className="storage-types-improved">
                          {getStorageTypes(desktop)}
                        </span>
                      </td>
                      <td className="status-cell-improved">
                        <span
                          className="status-badge-improved"
                          style={{
                            backgroundColor: `${getStatusColor(desktop.status)}20`,
                            color: getStatusColor(desktop.status),
                            borderColor: getStatusColor(desktop.status)
                          }}
                        >
                          {desktop.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {desktops.length > 0 && (
        <div className="results-summary-improved">
          <div className="summary-content-improved">
            Showing <strong>{desktops.length}</strong> desktops
            {Object.values(filters).some(f => f) && (
              <span className="filter-indicator-improved"> (filtered)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}