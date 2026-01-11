import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import EmployeeModal from '../components/Admin/EmployeeModal';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
  getPositions,
} from '../services/employeeService';
import '../styles/employee.css';

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department_id: '',
    position_id: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeesData, departmentsData, positionsData] = await Promise.all([
        getEmployees(filters),
        getDepartments(),
        getPositions(),
      ]);

      setEmployees(employeesData);
      setDepartments(departmentsData);
      setPositions(positionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setDeleteConfirm(employee);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const result = await deleteEmployee(deleteConfirm.employee_id);

    if (result.success) {
      setEmployees((prev) =>
        prev.filter((emp) => emp.employee_id !== deleteConfirm.employee_id)
      );
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete employee: ' + result.error);
    }
  };

  const handleModalSubmit = async (formData) => {
    let result;

    if (selectedEmployee) {
      result = await updateEmployee(selectedEmployee.employee_id, formData);
    } else {
      result = await createEmployee(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      loadData();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#f59e0b';
      case 'resigned':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="employee-container">
      <header className="employee-header">
        <div>
          <h1>Employee Management</h1>
          <p className="subtitle">Manage employee records and information</p>
        </div>
        <div className="header-actions">
          <button className="btn-back" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="employee-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or employee code..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="resigned">Resigned</option>
          </select>

          <select
            value={filters.department_id}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, department_id: e.target.value }))
            }
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>

          <select
            value={filters.position_id}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, position_id: e.target.value }))
            }
          >
            <option value="">All Positions</option>
            {positions.map((pos) => (
              <option key={pos.position_id} value={pos.position_id}>
                {pos.position_name}
              </option>
            ))}
          </select>

          <button className="btn-add" onClick={handleAddEmployee}>
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      <div className="employee-table-card">
        {loading ? (
          <div className="loading">Loading employees...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Date Deployed</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.employee_id}>
                      <td>{employee.employee_code || 'N/A'}</td>
                      <td className="employee-name">{employee.full_name}</td>
                      <td>{employee.departments?.department_name || 'N/A'}</td>
                      <td>{employee.positions?.position_name || 'N/A'}</td>
                      <td>{formatDate(employee.date_deployed)}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(employee.status)}20`,
                            color: getStatusColor(employee.status),
                          }}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditEmployee(employee)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteClick(employee)}
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

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        employee={selectedEmployee}
        departments={departments}
        positions={positions}
      />

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Employee</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>{deleteConfirm.full_name}</strong>?
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