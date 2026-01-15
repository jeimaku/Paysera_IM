import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PositionModal({ isOpen, onClose, onSubmit, position }) {
  const [formData, setFormData] = useState({
    position_name: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (position) {
      setFormData({
        position_name: position.position_name || '',
      });
    } else {
      setFormData({
        position_name: '',
      });
    }
  }, [position]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.position_name.trim()) {
      newErrors.position_name = 'Position name is required';
    }

    if (formData.position_name.trim().length < 2) {
      newErrors.position_name = 'Position name must be at least 2 characters';
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
      position_name: formData.position_name.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{position ? 'Edit Position' : 'Add New Position'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>
              Position Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="position_name"
              value={formData.position_name}
              onChange={handleChange}
              placeholder="e.g., Software Engineer, Manager, Specialist"
              className={errors.position_name ? 'error' : ''}
            />
            {errors.position_name && (
              <span className="error-message">{errors.position_name}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {position ? 'Update Position' : 'Add Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}