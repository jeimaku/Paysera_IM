import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Monitor as MonitorIcon } from 'lucide-react';
import MonitorModal from '../../components/Admin/MonitorModal';
import {
  getMonitors,
  createMonitor,
  updateMonitor,
  deleteMonitor,
} from '../../services/deviceService';
import '../../styles/inventory.css';

export default function MonitorInventory() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    brand: '',
  });

  // Get unique brands for filter
  const brands = [...new Set(monitors.map((m) => m.brand).filter(Boolean))];

  useEffect(() => {
    loadMonitors();
  }, [filters]);

  const loadMonitors = async () => {
    setLoading(true);
    try {
      const data = await getMonitors(filters);
      setMonitors(data);
    } catch (error) {
      console.error('Error loading monitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMonitor = () => {
    setSelectedMonitor(null);
    setIsModalOpen(true);
  };

  const handleEditMonitor = (monitor) => {
    setSelectedMonitor(monitor);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (monitor) => {
    setDeleteConfirm(monitor);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const result = await deleteMonitor(deleteConfirm.monitor_id);

    if (result.success) {
      setMonitors((prev) =>
        prev.filter((monitor) => monitor.monitor_id !== deleteConfirm.monitor_id)
      );
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete monitor: ' + result.error);
    }
  };

  const handleModalSubmit = async (formData) => {
    let result;

    if (selectedMonitor) {
      result = await updateMonitor(selectedMonitor.monitor_id, formData);
    } else {
      result = await createMonitor(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      loadMonitors();
    } else {
      alert('Error: ' + result.error);
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

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="header-title">
          <MonitorIcon size={32} className="header-icon" />
          <div>
            <h1>Monitor Inventory</h1>
            <p className="subtitle">Manage monitor displays and accessories</p>
          </div>
        </div>
      </header>

      <div className="inventory-stats">
        <div className="stat-item">
          <span className="stat-label">Total Monitors</span>
          <span className="stat-value">{monitors.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Available</span>
          <span className="stat-value stat-available">
            {monitors.filter((m) => m.status === 'available').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Issued</span>
          <span className="stat-value stat-issued">
            {monitors.filter((m) => m.status === 'issued').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Defective</span>
          <span className="stat-value stat-defective">
            {monitors.filter((m) => m.status === 'defective').length}
          </span>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by asset ID, brand, or model..."
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
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="defective">Defective</option>
          </select>

          <select
            value={filters.brand}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, brand: e.target.value }))
            }
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <button className="btn-add" onClick={handleAddMonitor}>
            <Plus size={18} />
            Add Monitor
          </button>
        </div>
      </div>

      <div className="inventory-table-card">
        {loading ? (
          <div className="loading">Loading monitors...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Model Code</th>
                  <th>Serial Number</th>
                  <th>Date Added</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {monitors.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No monitors found
                    </td>
                  </tr>
                ) : (
                  monitors.map((monitor) => (
                    <tr key={monitor.monitor_id}>
                      <td className="asset-id">{monitor.asset_id}</td>
                      <td>{monitor.brand}</td>
                      <td>{monitor.model}</td>
                      <td>{monitor.model_code || 'N/A'}</td>
                      <td>{monitor.serial_number || 'N/A'}</td>
                      <td>
                        {monitor.created_at
                          ? new Date(monitor.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(monitor.status)}20`,
                            color: getStatusColor(monitor.status),
                          }}
                        >
                          {monitor.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditMonitor(monitor)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteClick(monitor)}
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

      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        monitor={selectedMonitor}
      />

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Monitor</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>
                {deleteConfirm.brand} {deleteConfirm.model}
              </strong>{' '}
              ({deleteConfirm.asset_id})?
            </p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}