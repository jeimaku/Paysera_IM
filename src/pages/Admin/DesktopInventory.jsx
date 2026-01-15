import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, HardDrive } from 'lucide-react';
import DesktopModal from '../../components/Admin/DesktopModal';
import {
  getDesktops,
  createDesktop,
  updateDesktop,
  deleteDesktop,
} from '../../services/deviceService';
import '../../styles/inventory.css';

export default function DesktopInventory() {
  const [desktops, setDesktops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesktop, setSelectedDesktop] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const handleAddDesktop = () => {
    setSelectedDesktop(null);
    setIsModalOpen(true);
  };

  const handleEditDesktop = (desktop) => {
    setSelectedDesktop(desktop);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (desktop) => {
    setDeleteConfirm(desktop);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const result = await deleteDesktop(deleteConfirm.desktop_id);

    if (result.success) {
      setDesktops((prev) =>
        prev.filter((desktop) => desktop.desktop_id !== deleteConfirm.desktop_id)
      );
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete desktop: ' + result.error);
    }
  };

  const handleModalSubmit = async (formData) => {
    let result;

    if (selectedDesktop) {
      result = await updateDesktop(selectedDesktop.desktop_id, formData);
    } else {
      result = await createDesktop(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      loadDesktops();
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

  const calculateTotalRAM = (desktop) => {
    if (!desktop.desktop_memory || desktop.desktop_memory.length === 0) {
      return 'N/A';
    }
    const total = desktop.desktop_memory.reduce(
      (sum, mem) => sum + (mem.size_gb || 0),
      0
    );
    return `${total}GB`;
  };

  const calculateTotalStorage = (desktop) => {
    if (!desktop.desktop_storage || desktop.desktop_storage.length === 0) {
      return 'N/A';
    }
    const total = desktop.desktop_storage.reduce(
      (sum, stor) => sum + (stor.capacity_gb || 0),
      0
    );
    return `${total}GB`;
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
      <header className="inventory-header">
        <div className="header-title">
          <HardDrive size={32} className="header-icon" />
          <div>
            <h1>Desktop Inventory</h1>
            <p className="subtitle">Manage desktop PCs and system units</p>
          </div>
        </div>
      </header>

      <div className="inventory-stats">
        <div className="stat-item">
          <span className="stat-label">Total Desktops</span>
          <span className="stat-value">{desktops.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Available</span>
          <span className="stat-value stat-available">
            {desktops.filter((d) => d.status === 'available').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Issued</span>
          <span className="stat-value stat-issued">
            {desktops.filter((d) => d.status === 'issued').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Defective</span>
          <span className="stat-value stat-defective">
            {desktops.filter((d) => d.status === 'defective').length}
          </span>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by asset ID or processor..."
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

          <button className="btn-add" onClick={handleAddDesktop}>
            <Plus size={18} />
            Add Desktop
          </button>
        </div>
      </div>

      <div className="inventory-table-card">
        {loading ? (
          <div className="loading">Loading desktops...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Operating System</th>
                  <th>Processor</th>
                  <th>Total RAM</th>
                  <th>Total Storage</th>
                  <th>Storage Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {desktops.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No desktops found
                    </td>
                  </tr>
                ) : (
                  desktops.map((desktop) => (
                    <tr key={desktop.desktop_id}>
                      <td className="asset-id">{desktop.asset_id}</td>
                      <td>{desktop.operating_system || 'N/A'}</td>
                      <td className="cpu-cell">{desktop.processor || 'N/A'}</td>
                      <td>{calculateTotalRAM(desktop)}</td>
                      <td>{calculateTotalStorage(desktop)}</td>
                      <td>{getStorageTypes(desktop)}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(desktop.status)}20`,
                            color: getStatusColor(desktop.status),
                          }}
                        >
                          {desktop.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditDesktop(desktop)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteClick(desktop)}
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

      <DesktopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        desktop={selectedDesktop}
      />

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Desktop</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>{deleteConfirm.asset_id}</strong>?
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