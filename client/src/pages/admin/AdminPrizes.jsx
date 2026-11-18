import React, { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import posterImg from '../../assets/grand-lucky-draw-poster.jpg';
import { resolveImageUrl, handleImageError } from '../../utils/imageHelper';

const AdminPrizes = () => {
  const { showToast } = useToast();
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'SUV',
    quantity: 1,
    description: '',
    imageUrl: '',
    displayOrder: 1,
    features: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPrizes = async () => {
    try {
      const res = await api.get('/prizes/admin');
      if (res.data.success) {
        setPrizes(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load prizes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const openCreateModal = () => {
    setEditingPrize(null);
    setFormData({
      name: '',
      category: 'SUV',
      quantity: 1,
      description: '',
      imageUrl: '/uploads/prizes/grand-poster.jpg',
      displayOrder: prizes.length + 1,
      features: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (prize) => {
    setEditingPrize(prize);
    setFormData({
      name: prize.name,
      category: prize.category,
      quantity: prize.quantity,
      description: prize.description || '',
      imageUrl: prize.imageUrl || '',
      displayOrder: prize.displayOrder || 1,
      features: Array.isArray(prize.features) ? prize.features.join(', ') : ''
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.post('/prizes/upload-image', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
        showToast('Image uploaded successfully', 'success');
      }
    } catch (err) {
      showToast('Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.quantity < 1) {
      showToast('Please enter prize name and valid quantity', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        quantity: Number(formData.quantity),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        displayOrder: Number(formData.displayOrder),
        features: formData.features
          ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
          : []
      };

      if (editingPrize) {
        await api.put(`/prizes/${editingPrize._id}`, payload);
        showToast(`Prize "${formData.name}" updated successfully`, 'success');
      } else {
        await api.post('/prizes', payload);
        showToast(`New prize "${formData.name}" added to catalogue`, 'success');
      }

      setModalOpen(false);
      fetchPrizes();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save prize', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePrizeActive = async (prize) => {
    try {
      const res = await api.patch(`/prizes/${prize._id}/toggle`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchPrizes();
      }
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const totalPrizeUnits = prizes.reduce((sum, p) => sum + (p.quantity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
            PRIZE <span className="text-gold-gradient">MANAGEMENT</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Dynamic prize catalogue • Currently listing {totalPrizeUnits} grand prize units.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#0F172A]" />
          <span>Add New Prize Category</span>
        </button>
      </div>

      {/* Grid of Prizes */}
      {loading ? (
        <div className="p-8 text-[#8C610A] font-mono font-bold">Loading prizes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prizes.map((prize) => (
            <div
              key={prize._id}
              className={`luxury-card rounded-2xl overflow-hidden flex flex-col justify-between border border-[#E2E8F0] shadow-sm ${
                !prize.isActive ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div>
                <div className="h-44 bg-gray-100 relative overflow-hidden border-b border-[#E2E8F0]">
                  <img
                    src={resolveImageUrl(prize.imageUrl)}
                    alt={prize.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/50 text-[11px] font-bold text-[#8C610A] font-mono shadow-sm">
                    {prize.quantity} Units
                  </div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-[10px] font-bold text-[#8C610A] uppercase tracking-wider">
                    {prize.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0F172A] font-heading">{prize.name}</h3>
                    <span className="text-[10px] font-mono text-[#64748B]">Order: #{prize.displayOrder}</span>
                  </div>
                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {prize.description || 'No description provided'}
                  </p>

                  <div className="pt-2 text-xs text-[#64748B] font-mono">
                    Winners assigned: <strong className="text-[#8C610A] font-bold">{prize.winnersCount || 0} / {prize.quantity}</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-[#E2E8F0] mt-2">
                <button
                  onClick={() => togglePrizeActive(prize)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                    prize.isActive
                      ? 'bg-emerald-100 text-[#047857] border border-emerald-300'
                      : 'bg-gray-100 text-[#64748B] border border-gray-300'
                  }`}
                >
                  {prize.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{prize.isActive ? 'Active' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => openEditModal(prize)}
                  className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[#0F172A] hover:text-[#8C610A] hover:bg-[#FAF8F5] flex items-center gap-1.5 text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                {editingPrize ? 'Edit Prize Details' : 'Add New Prize Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#334155]">Prize Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Toyota Fortuner 4x4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#8C610A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#334155]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-[#8C610A]"
                  >
                    <option value="SUV">SUV</option>
                    <option value="CAR">CAR</option>
                    <option value="TWO_WHEELER">TWO_WHEELER</option>
                    <option value="REAL_ESTATE">REAL_ESTATE</option>
                    <option value="ELECTRONICS">ELECTRONICS</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#334155]">Quantity (Units) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs font-mono font-bold focus:outline-none focus:border-[#8C610A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-[#334155]">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs font-mono focus:outline-none focus:border-[#8C610A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#334155]">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specifications, model trim, and details"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#8C610A] placeholder-[#94A3B8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#334155]">Key Features (Comma-Separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Automatic, Sunroof, Leather Seats, 4x4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#8C610A] placeholder-[#94A3B8]"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[#334155]">Prize Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-[#475569] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#CBD5E1] file:text-xs file:font-bold file:bg-[#FAF8F5] file:text-[#0F172A] hover:file:bg-[#F1EADA]"
                  />
                  {uploadingImage && <span className="text-xs text-[#8C610A] font-mono font-bold">Uploading...</span>}
                </div>
                {formData.imageUrl && (
                  <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#CBD5E1] bg-gray-50">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#475569] hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold px-6 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Save Prize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrizes;
