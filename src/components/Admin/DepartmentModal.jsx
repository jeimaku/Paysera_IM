import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function DepartmentModal({ isOpen, onClose, onSubmit, department }) {
  const [formData, setFormData] = useState({
    department_name: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        department_name: department.department_name || '',
      });
    } else {
      setFormData({
        department_name: '',
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.department_name.trim()) {
      newErrors.department_name = 'Department name is required';
    }

    if (formData.department_name.trim().length < 2) {
      newErrors.department_name = 'Department name must be at least 2 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      department_name: formData.department_name.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{department ? 'Edit Department' : 'Add New Department'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>
              Department Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="department_name"
              value={formData.department_name}
              onChange={handleChange}
              placeholder="e.g., Human Resources, IT Department, Marketing"
              className={errors.department_name ? 'error' : ''}
            />
            {errors.department_name && (
              <span className="error-message">{errors.department_name}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {department ? 'Update Department' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}