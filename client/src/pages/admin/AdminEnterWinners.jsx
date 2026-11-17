import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Gift,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminEnterWinners = () => {
  const { showToast } = useToast();
  const [prizes, setPrizes] = useState([]);
  const [selectedPrizeId, setSelectedPrizeId] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Winner Inputs
  const [winnerIds, setWinnerIds] = useState(['']);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Search autocomplete helper
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchPrerequisites = async () => {
      try {
        const [prizeRes, snapRes] = await Promise.all([
          api.get('/prizes'),
          api.get('/draw/latest-snapshot').catch(() => ({ data: { success: false } }))
        ]);

        if (prizeRes.data.success) {
          setPrizes(prizeRes.data.data);
          if (prizeRes.data.data.length > 0) {
            setSelectedPrizeId(prizeRes.data.data[0]._id);
            setSelectedPrize(prizeRes.data.data[0]);
          }
        }
        if (snapRes.data.success) {
          setSnapshot(snapRes.data.data);
        }
      } catch (err) {
        console.error('[Enter Winners Init Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrerequisites();
  }, []);

  const handlePrizeChange = (e) => {
    const pId = e.target.value;
    setSelectedPrizeId(pId);
    const p = prizes.find((item) => item._id === pId);
    setSelectedPrize(p);
  };

  const addWinnerInput = () => {
    setWinnerIds((prev) => [...prev, '']);
  };

  const updateWinnerInput = (index, value) => {
    const updated = [...winnerIds];
    updated[index] = value.toUpperCase();
    setWinnerIds(updated);
    setValidationErrors([]);
  };

  const removeWinnerInput = (index) => {
    if (winnerIds.length === 1) {
      setWinnerIds(['']);
      return;
    }
    setWinnerIds(winnerIds.filter((_, i) => i !== index));
  };

  // Autocomplete helper
  const handleSearchParticipants = async (val) => {
    setSearchQuery(val);
    if (!val || val.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await api.get(`/winners/search-eligible?q=${encodeURIComponent(val)}`);
      if (res.data.success) {
        setSearchResults(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const selectSearchResult = (pId) => {
    // Fill first empty slot or append
    const firstEmptyIndex = winnerIds.findIndex((id) => !id || id.trim() === '');
    if (firstEmptyIndex !== -1) {
      updateWinnerInput(firstEmptyIndex, pId);
    } else {
      setWinnerIds((prev) => [...prev, pId]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Submit Winners to Step 6 Approval Queue
  const handleSubmitWinners = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    const cleanIds = winnerIds.map((id) => id.trim().toUpperCase()).filter(Boolean);
    if (cleanIds.length === 0) {
      showToast('Please enter at least one winning participant ID', 'error');
      return;
    }

    if (!snapshot) {
      showToast('Cannot enter winners: You must freeze the participant list in Draw Management first!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/winners/enter', {
        prizeId: selectedPrizeId,
        participantIds: cleanIds,
        notes: notes.trim()
      });

      if (res.data.success) {
        showToast(res.data.message, 'success');
        setWinnerIds(['']);
        setNotes('');
        // Refresh prizes
        const pRes = await api.get('/prizes');
        if (pRes.data.success) setPrizes(pRes.data.data);
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.errors && Array.isArray(resp.errors)) {
        setValidationErrors(resp.errors);
      } else {
        showToast(resp?.message || 'Failed to enter winners', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gold-400 font-mono">Loading manual winner entry...</div>;
  }

  const remainingQuota = selectedPrize ? Math.max(0, selectedPrize.quantity - (selectedPrize.winnersCount || 0)) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
          ENTER <span className="text-gold-gradient">MANUAL WINNERS</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Record winning participant IDs from the physical manual draw. Enforces multi-tier validation against the frozen list.
        </p>
      </div>

      {!snapshot && (
        <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3 text-yellow-300 text-xs">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <strong>Step 2 Pending:</strong> The participant list has not been frozen yet! You must go to{' '}
            <strong className="underline">Draw Management</strong> and click "Freeze Participant List" before entering winners.
          </div>
        </div>
      )}

      {/* Main Entry Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 shadow-card-dark space-y-6">
        <form onSubmit={handleSubmitWinners} className="space-y-6">
          {/* Prize Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Select Prize Category *
              </label>
              <select
                value={selectedPrizeId}
                onChange={handlePrizeChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              >
                {prizes.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.quantity} Total - {p.winnersCount || 0} Assigned)
                  </option>
                ))}
              </select>
            </div>

            {/* Quota Indicator */}
            {selectedPrize && (
              <div className="p-4 rounded-xl bg-dark-950 border border-gray-800 space-y-1 text-xs font-mono">
                <span className="text-gray-500 uppercase">Prize Quota Status</span>
                <div className="text-white font-bold text-sm">
                  Required Winners: <strong className="text-gold-400">{selectedPrize.quantity}</strong>
                </div>
                <div className="text-gray-400 text-[11px]">
                  Already Assigned: {selectedPrize.winnersCount || 0} • Available slots: <span className="text-emerald-400 font-bold">{remainingQuota}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Autocomplete Search from Frozen Snapshot */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
              <span>Quick Lookup from Frozen List</span>
              <span className="text-[11px] text-gray-500 font-normal">Search by participant ID or name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchParticipants(e.target.value)}
                placeholder="Type 'LD2027' or participant name..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-dark-950 border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-gold-400"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="p-2 rounded-xl bg-dark-950 border border-gold-500/30 space-y-1 max-h-48 overflow-y-auto">
                {searchResults.map((sr) => (
                  <div
                    key={sr.participantId}
                    onClick={() => !sr.alreadyWon && selectSearchResult(sr.participantId)}
                    className={`p-2.5 rounded-lg flex items-center justify-between text-xs cursor-pointer ${
                      sr.alreadyWon
                        ? 'opacity-40 cursor-not-allowed bg-red-500/10'
                        : 'hover:bg-gold-500/15'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold text-gold-300">{sr.participantId}</span>
                      <span className="text-gray-300 ml-2">{sr.fullName}</span>
                      <span className="text-gray-500 text-[11px] ml-2">({sr.city}, {sr.state})</span>
                    </div>
                    {sr.alreadyWon ? (
                      <span className="text-[10px] text-red-400 font-bold">Already Won Prize</span>
                    ) : (
                      <span className="text-[10px] text-gold-400 font-bold">+ Select</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Winner Participant IDs Inputs List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Winning Participant IDs (from Physical Draw)
              </label>
              <button
                type="button"
                onClick={addWinnerInput}
                className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Winner Entry</span>
              </button>
            </div>

            <div className="space-y-2">
              {winnerIds.map((idVal, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 w-20">Winner #{idx + 1}:</span>
                  <input
                    type="text"
                    value={idVal}
                    onChange={(e) => updateWinnerInput(idx, e.target.value)}
                    placeholder="e.g. LD2027-000001"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl bg-dark-950 border border-gold-500/30 text-white font-mono text-sm focus:outline-none focus:border-gold-400 uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => removeWinnerInput(idx)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Draw Session Notes / Token Barrel Details
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Drawn in physical session 1 supervised by Chief Legal Officer"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-gray-800 text-white text-xs"
            />
          </div>

          {/* Validation Errors Box */}
          {validationErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 space-y-2 text-red-300 text-xs">
              <span className="font-bold block">Validation Errors:</span>
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit to Two-Step Approval Queue */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !snapshot}
              className="btn-gold w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow"
            >
              <ShieldCheck className="w-4 h-4 text-dark-950" />
              <span>{submitting ? 'Validating against Frozen Snapshot...' : 'Submit to Two-Step Dual-Admin Approval Queue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEnterWinners;
