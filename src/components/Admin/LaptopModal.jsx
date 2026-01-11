import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function LaptopModal({ isOpen, onClose, onSubmit, laptop }) {
  const [formData, setFormData] = useState({
    asset_id: '',
    brand: '',
    model: '',
    serial_number: '',
    unit: '',
    system_model: '',
    operating_system: '',
    cpu: '',
    memory: '',
    storage: '',
    storage_type: '',
    status: 'available',
    warranty_end: '',
    distributor: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (laptop) {
      setFormData({
        asset_id: laptop.asset_id || '',
        brand: laptop.brand || '',
        model: laptop.model || '',
        serial_number: laptop.serial_number || '',
        unit: laptop.unit || '',
        system_model: laptop.system_model || '',
        operating_system: laptop.operating_system || '',
        cpu: laptop.cpu || '',
        memory: laptop.memory || '',
        storage: laptop.storage || '',
        storage_type: laptop.storage_type || '',
        status: laptop.status || 'available',
        warranty_end: laptop.warranty_end || '',
        distributor: laptop.distributor || '',
      });
    } else {
      setFormData({
        asset_id: '',
        brand: '',
        model: '',
        serial_number: '',
        unit: '',
        system_model: '',
        operating_system: '',
        cpu: '',
        memory: '',
        storage: '',
        storage_type: '',
        status: 'available',
        warranty_end: '',
        distributor: '',
      });
    }
  }, [laptop]);

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

    // Convert memory and storage to integers if they have values
    const submitData = {
      ...formData,
      memory: formData.memory ? parseInt(formData.memory) : null,
      storage: formData.storage ? parseInt(formData.storage) : null,
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{laptop ? 'Edit Laptop' : 'Add New Laptop'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Row 1: Asset ID and Brand */}
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
                placeholder="e.g., LP-001"
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
                placeholder="e.g., LENOVO, DELL, HP"
                className={errors.brand ? 'error' : ''}
              />
              {errors.brand && (
                <span className="error-message">{errors.brand}</span>
              )}
            </div>
          </div>

          {/* Row 2: Model and Serial Number */}
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
                placeholder="e.g., ThinkPad X1 Carbon"
                className={errors.model ? 'error' : ''}
              />
              {errors.model && (
                <span className="error-message">{errors.model}</span>
              )}
            </div>

            <div className="form-group">
              <label>Serial Number</label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                placeholder="e.g., PF5EB6Z9"
              />
            </div>
          </div>

          {/* Row 3: Unit and System Model */}
          <div className="form-row">
            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., Unit A"
              />
            </div>

            <div className="form-group">
              <label>System Model</label>
              <input
                type="text"
                name="system_model"
                value={formData.system_model}
                onChange={handleChange}
                placeholder="e.g., 20U90009US"
              />
            </div>
          </div>

          {/* Row 4: OS and CPU */}
          <div className="form-row">
            <div className="form-group">
              <label>Operating System</label>
              <input
                type="text"
                name="operating_system"
                value={formData.operating_system}
                onChange={handleChange}
                placeholder="e.g., Windows 11 Pro"
              />
            </div>

            <div className="form-group">
              <label>CPU</label>
              <input
                type="text"
                name="cpu"
                value={formData.cpu}
                onChange={handleChange}
                placeholder="e.g., Intel Core i7-1185G7"
              />
            </div>
          </div>

          {/* Row 5: Memory and Storage */}
          <div className="form-row">
            <div className="form-group">
              <label>Memory (GB)</label>
              <input
                type="number"
                name="memory"
                value={formData.memory}
                onChange={handleChange}
                placeholder="e.g., 16"
              />
            </div>

            <div className="form-group">
              <label>Storage (GB)</label>
              <input
                type="number"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                placeholder="e.g., 512"
              />
            </div>
          </div>

          {/* Row 6: Storage Type and Status */}
          <div className="form-row">
            <div className="form-group">
              <label>Storage Type</label>
              <select
                name="storage_type"
                value={formData.storage_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="SSD">SSD</option>
                <option value="HDD">HDD</option>
                <option value="NVMe">NVMe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="defective">Defective</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>

          {/* Row 7: Warranty and Distributor */}
          <div className="form-row">
            <div className="form-group">
              <label>Warranty End Date</label>
              <input
                type="date"
                name="warranty_end"
                value={formData.warranty_end}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Distributor</label>
              <input
                type="text"
                name="distributor"
                value={formData.distributor}
                onChange={handleChange}
                placeholder="e.g., FiveTwenty IT Services"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {laptop ? 'Update Laptop' : 'Add Laptop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}