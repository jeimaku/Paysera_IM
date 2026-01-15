import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, UserCheck } from 'lucide-react';
import PositionModal from '../../components/Admin/PositionModal';
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} from '../../services/organizationService';
import '../../styles/inventory.css';

export default function PositionManagement() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
  });

  useEffect(() => {
    loadPositions();
  }, [filters]);

  const loadPositions = async () => {
    setLoading(true);
    try {
      const data = await getPositions(filters);
      setPositions(data);
    } catch (error) {
      console.error('Error loading positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPosition = () => {
    setSelectedPosition(null);
    setIsModalOpen(true);
  };

  const handleEditPosition = (position) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (position) => {
    setDeleteConfirm(position);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const result = await deletePosition(deleteConfirm.position_id);

    if (result.success) {
      setPositions((prev) =>
        prev.filter((pos) => pos.position_id !== deleteConfirm.position_id)
      );
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete position: ' + result.error);
    }
  };

  const handleModalSubmit = async (formData) => {
    let result;

    if (selectedPosition) {
      result = await updatePosition(selectedPosition.position_id, formData);
    } else {
      result = await createPosition(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      loadPositions();
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="header-title">
          <UserCheck size={32} className="header-icon" />
          <div>
            <h1>Position Management</h1>
            <p className="subtitle">Manage company positions and job roles</p>
          </div>
        </div>
      </header>

      <div className="inventory-stats">
        <div className="stat-item">
          <span className="stat-label">Total Positions</span>
          <span className="stat-value">{positions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active Positions</span>
          <span className="stat-value stat-available">{positions.length}</span>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search positions..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="filters">
          <button className="btn-add" onClick={handleAddPosition}>
            <Plus size={18} />
            Add Position
          </button>
        </div>
      </div>

      <div className="inventory-table-card">
        {loading ? (
          <div className="loading">Loading positions...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Position Name</th>
                  <th>Employee Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No positions found
                    </td>
                  </tr>
                ) : (
                  positions.map((position) => (
                    <tr key={position.position_id}>
                      <td className="asset-id">{position.position_id}</td>
                      <td className="position-name">
                        <strong>{position.position_name}</strong>
                      </td>
                      <td>{position.employee_count || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditPosition(position)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteClick(position)}
                            title="Delete"
                            disabled={position.employee_count > 0}
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

      <PositionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        position={selectedPosition}
      />

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Position</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>"{deleteConfirm.position_name}"</strong>?
            </p>
            {deleteConfirm.employee_count > 0 ? (
              <p className="warning-text">
                This position has {deleteConfirm.employee_count} employee(s). 
                You cannot delete a position with active employees.
              </p>
            ) : (
              <p className="warning-text">This action cannot be undone.</p>
            )}
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              {deleteConfirm.employee_count === 0 && (
                <button className="btn-danger" onClick={handleDeleteConfirm}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}