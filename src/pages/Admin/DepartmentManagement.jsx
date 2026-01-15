import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Building2 } from 'lucide-react';
import DepartmentModal from '../../components/Admin/DepartmentModal';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../../services/organizationService';
import '../../styles/inventory.css';

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
  });

  useEffect(() => {
    loadDepartments();
  }, [filters]);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartments(filters);
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (department) => {
    setDeleteConfirm(department);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const result = await deleteDepartment(deleteConfirm.department_id);

    if (result.success) {
      setDepartments((prev) =>
        prev.filter((dept) => dept.department_id !== deleteConfirm.department_id)
      );
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete department: ' + result.error);
    }
  };

  const handleModalSubmit = async (formData) => {
    let result;

    if (selectedDepartment) {
      result = await updateDepartment(selectedDepartment.department_id, formData);
    } else {
      result = await createDepartment(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      loadDepartments();
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="header-title">
          <Building2 size={32} className="header-icon" />
          <div>
            <h1>Department Management</h1>
            <p className="subtitle">Manage company departments and organizational structure</p>
          </div>
        </div>
      </header>

      <div className="inventory-stats">
        <div className="stat-item">
          <span className="stat-label">Total Departments</span>
          <span className="stat-value">{departments.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active Departments</span>
          <span className="stat-value stat-available">{departments.length}</span>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search departments..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="filters">
          <button className="btn-add" onClick={handleAddDepartment}>
            <Plus size={18} />
            Add Department
          </button>
        </div>
      </div>

      <div className="inventory-table-card">
        {loading ? (
          <div className="loading">Loading departments...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Employee Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No departments found
                    </td>
                  </tr>
                ) : (
                  departments.map((department) => (
                    <tr key={department.department_id}>
                      <td className="asset-id">{department.department_id}</td>
                      <td className="department-name">
                        <strong>{department.department_name}</strong>
                      </td>
                      <td>{department.employee_count || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditDepartment(department)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteClick(department)}
                            title="Delete"
                            disabled={department.employee_count > 0}
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

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        department={selectedDepartment}
      />

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Department</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>"{deleteConfirm.department_name}"</strong>?
            </p>
            {deleteConfirm.employee_count > 0 ? (
              <p className="warning-text">
                This department has {deleteConfirm.employee_count} employee(s). 
                You cannot delete a department with active employees.
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