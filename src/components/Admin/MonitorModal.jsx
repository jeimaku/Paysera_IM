import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MonitorModal({ isOpen, onClose, onSubmit, monitor }) {
  const [formData, setFormData] = useState({
    asset_id: '',
    brand: '',
    model: '',
    model_code: '',
    serial_number: '',
    status: 'available',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (monitor) {
      setFormData({
        asset_id: monitor.asset_id || '',
        brand: monitor.brand || '',
        model: monitor.model || '',
        model_code: monitor.model_code || '',
        serial_number: monitor.serial_number || '',
        status: monitor.status || 'available',
      });
    } else {
      setFormData({
        asset_id: '',
        brand: '',
        model: '',
        model_code: '',
        serial_number: '',
        status: 'available',
      });
    }
  }, [monitor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.asset_id.trim()) {
      newErrors.asset_id = 'Asset ID is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
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

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{monitor ? 'Edit Monitor' : 'Add New Monitor'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                Asset ID <span className="required">*</span>
              </label>
              <input
                type="text"
                name="asset_id"
                value={formData.asset_id}
                onChange={handleChange}
                placeholder="e.g., MON-001"
                className={errors.asset_id ? 'error' : ''}
              />
              {errors.asset_id && (
                <span className="error-message">{errors.asset_id}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                Brand <span className="required">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., DELL, HP, SAMSUNG"
                className={errors.brand ? 'error' : ''}
              />
              {errors.brand && (
                <span className="error-message">{errors.brand}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Model <span className="required">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., UltraSharp U2419H"
                className={errors.model ? 'error' : ''}
              />
              {errors.model && (
                <span className="error-message">{errors.model}</span>
              )}
            </div>

            <div className="form-group">
              <label>Model Code</label>
              <input
                type="text"
                name="model_code"
                value={formData.model_code}
                onChange={handleChange}
                placeholder="e.g., U2419H"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Serial Number</label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                placeholder="e.g., ABC123456789"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="defective">Defective</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {monitor ? 'Update Monitor' : 'Add Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}