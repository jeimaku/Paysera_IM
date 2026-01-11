import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function DesktopModal({ isOpen, onClose, onSubmit, desktop }) {
  const [formData, setFormData] = useState({
    asset_id: '',
    operating_system: '',
    processor: '',
    status: 'available',
  });

  const [memory, setMemory] = useState([
    { slot_number: 'DIMM1', size_gb: '' },
  ]);

  const [storage, setStorage] = useState([
    { storage_type: 'HDD', capacity_gb: '' },
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (desktop) {
      setFormData({
        asset_id: desktop.asset_id || '',
        operating_system: desktop.operating_system || '',
        processor: desktop.processor || '',
        status: desktop.status || 'available',
      });

      // Set memory modules
      if (desktop.desktop_memory && desktop.desktop_memory.length > 0) {
        setMemory(
          desktop.desktop_memory.map((m) => ({
            slot_number: m.slot_number,
            size_gb: m.size_gb || '',
          }))
        );
      } else {
        setMemory([{ slot_number: 'DIMM1', size_gb: '' }]);
      }

      // Set storage devices
      if (desktop.desktop_storage && desktop.desktop_storage.length > 0) {
        setStorage(
          desktop.desktop_storage.map((s) => ({
            storage_type: s.storage_type,
            capacity_gb: s.capacity_gb || '',
          }))
        );
      } else {
        setStorage([{ storage_type: 'HDD', capacity_gb: '' }]);
      }
    } else {
      setFormData({
        asset_id: '',
        operating_system: '',
        processor: '',
        status: 'available',
      });
      setMemory([{ slot_number: 'DIMM1', size_gb: '' }]);
      setStorage([{ storage_type: 'HDD', capacity_gb: '' }]);
    }
  }, [desktop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMemoryChange = (index, field, value) => {
    const newMemory = [...memory];
    newMemory[index][field] = value;
    setMemory(newMemory);
  };

  const addMemory = () => {
    const availableSlots = ['DIMM1', 'DIMM2', 'DIMM3', 'DIMM4'];
    const usedSlots = memory.map((m) => m.slot_number);
    const nextSlot = availableSlots.find((slot) => !usedSlots.includes(slot));

    if (nextSlot) {
      setMemory([...memory, { slot_number: nextSlot, size_gb: '' }]);
    } else {
      alert('Maximum 4 memory slots');
    }
  };

  const removeMemory = (index) => {
    if (memory.length > 1) {
      setMemory(memory.filter((_, i) => i !== index));
    }
  };

  const handleStorageChange = (index, field, value) => {
    const newStorage = [...storage];
    newStorage[index][field] = value;
    setStorage(newStorage);
  };

  const addStorage = () => {
    setStorage([...storage, { storage_type: 'HDD', capacity_gb: '' }]);
  };

  const removeStorage = (index) => {
    if (storage.length > 1) {
      setStorage(storage.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.asset_id.trim()) {
      newErrors.asset_id = 'Asset ID is required';
    }

    if (!formData.processor.trim()) {
      newErrors.processor = 'Processor is required';
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

    // Filter out empty memory and storage entries
    const filteredMemory = memory.filter((m) => m.size_gb);
    const filteredStorage = storage.filter((s) => s.capacity_gb);

    // Convert to integers
    const processedMemory = filteredMemory.map((m) => ({
      slot_number: m.slot_number,
      size_gb: parseInt(m.size_gb),
    }));

    const processedStorage = filteredStorage.map((s) => ({
      storage_type: s.storage_type,
      capacity_gb: parseInt(s.capacity_gb),
    }));

    const submitData = {
      ...formData,
      memory: processedMemory,
      storage: processedStorage,
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{desktop ? 'Edit Desktop' : 'Add New Desktop'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Basic Info */}
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
                placeholder="e.g., PC-001"
                className={errors.asset_id ? 'error' : ''}
              />
              {errors.asset_id && (
                <span className="error-message">{errors.asset_id}</span>
              )}
            </div>

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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Processor <span className="required">*</span>
              </label>
              <input
                type="text"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="e.g., Intel Core i7-12700"
                className={errors.processor ? 'error' : ''}
              />
              {errors.processor && (
                <span className="error-message">{errors.processor}</span>
              )}
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

          {/* Memory Section */}
          <div className="subsection">
            <div className="subsection-header">
              <h3>Memory Modules (RAM)</h3>
              <button
                type="button"
                className="btn-icon-text"
                onClick={addMemory}
                disabled={memory.length >= 4}
              >
                <Plus size={16} />
                Add Slot
              </button>
            </div>

            {memory.map((mem, index) => (
              <div key={index} className="form-row">
                <div className="form-group">
                  <label>Slot</label>
                  <select
                    value={mem.slot_number}
                    onChange={(e) =>
                      handleMemoryChange(index, 'slot_number', e.target.value)
                    }
                  >
                    <option value="DIMM1">DIMM1</option>
                    <option value="DIMM2">DIMM2</option>
                    <option value="DIMM3">DIMM3</option>
                    <option value="DIMM4">DIMM4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Size (GB)</label>
                  <input
                    type="number"
                    value={mem.size_gb}
                    onChange={(e) =>
                      handleMemoryChange(index, 'size_gb', e.target.value)
                    }
                    placeholder="e.g., 8, 16, 32"
                  />
                </div>

                {memory.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon btn-delete"
                    onClick={() => removeMemory(index)}
                    style={{ marginTop: '24px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Storage Section */}
          <div className="subsection">
            <div className="subsection-header">
              <h3>Storage Devices</h3>
              <button
                type="button"
                className="btn-icon-text"
                onClick={addStorage}
              >
                <Plus size={16} />
                Add Storage
              </button>
            </div>

            {storage.map((stor, index) => (
              <div key={index} className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={stor.storage_type}
                    onChange={(e) =>
                      handleStorageChange(index, 'storage_type', e.target.value)
                    }
                  >
                    <option value="HDD">HDD</option>
                    <option value="SSD">SSD</option>
                    <option value="NVMe">NVMe</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Capacity (GB)</label>
                  <input
                    type="number"
                    value={stor.capacity_gb}
                    onChange={(e) =>
                      handleStorageChange(index, 'capacity_gb', e.target.value)
                    }
                    placeholder="e.g., 256, 512, 1000"
                  />
                </div>

                {storage.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon btn-delete"
                    onClick={() => removeStorage(index)}
                    style={{ marginTop: '24px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {desktop ? 'Update Desktop' : 'Add Desktop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}