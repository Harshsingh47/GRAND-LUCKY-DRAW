import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminReports = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await api.get('/reports/summary');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        showToast('Failed to load reports summary', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const handleExportWinners = (format) => {
    window.open(`/api/reports/winners/export?format=${format}`, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-gold-400 font-mono">Generating analytics and reports...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            REPORTS & <span className="text-gold-gradient">ANALYTICS</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Campaign distribution analytics and exportable compliance reports.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportWinners('xlsx')}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-gold-glow"
          >
            <FileSpreadsheet className="w-4 h-4 text-dark-950" />
            <span>Export Winners (Excel)</span>
          </button>
          <button
            onClick={() => handleExportWinners('csv')}
            className="btn-outline-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total Registrations Processed</span>
          <div className="text-3xl font-black font-mono text-white">
            {data?.totalRegistrations?.toLocaleString() || 0}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Mobile Verified Participants</span>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {data?.verifiedCount?.toLocaleString() || 0}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Disqualified Entries</span>
          <div className="text-3xl font-black font-mono text-red-400">
            {data?.disqualifiedCount?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {/* Prize Distribution Progress */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-heading">Prize Quota vs. Winner Assignment</h3>
          <span className="text-xs text-gold-400 font-mono">70 Total Listed Units</span>
        </div>

        <div className="space-y-4">
          {data?.prizeDistribution?.map((p, idx) => {
            const pct = Math.min(100, Math.round(((p.winnersCount || 0) / (p.quantity || 1)) * 100));
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{p.name}</span>
                  <span className="font-mono text-gray-400">
                    <strong className="text-gold-300">{p.winnersCount || 0}</strong> of {p.quantity} Winners Assigned ({pct}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-dark-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-yellow-200 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State Breakdown */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold-400" />
          <h3 className="text-lg font-bold text-white font-heading">Geographic Participation Breakdown</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data?.stateDistribution?.map((st, i) => (
            <div key={i} className="p-4 rounded-xl bg-dark-950 border border-gray-800 space-y-1">
              <span className="text-xs font-semibold text-gray-400 block truncate">{st._id || 'Other'}</span>
              <span className="text-lg font-black font-mono text-gold-300">{st.count} entries</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
