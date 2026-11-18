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
    return <div className="p-8 text-[#8C610A] font-mono font-bold">Generating analytics and reports...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
            REPORTS & <span className="text-gold-gradient">ANALYTICS</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Campaign distribution analytics and exportable compliance reports.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportWinners('xlsx')}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0F172A]" />
            <span>Export Winners (Excel)</span>
          </button>
          <button
            onClick={() => handleExportWinners('csv')}
            className="btn-outline-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#8C610A]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Registrations Processed</span>
          <div className="text-3xl font-black font-mono text-[#0F172A]">
            {data?.totalRegistrations?.toLocaleString() || 0}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Mobile Verified Participants</span>
          <div className="text-3xl font-black font-mono text-[#047857]">
            {data?.verifiedCount?.toLocaleString() || 0}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Disqualified Entries</span>
          <div className="text-3xl font-black font-mono text-[#B91C1C]">
            {data?.disqualifiedCount?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {/* Prize Distribution Progress */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A] font-heading">Prize Quota vs. Winner Assignment</h3>
          <span className="text-xs text-[#8C610A] font-mono font-bold">70 Total Listed Units</span>
        </div>

        <div className="space-y-4">
          {data?.prizeDistribution?.map((p, idx) => {
            const pct = Math.min(100, Math.round(((p.winnersCount || 0) / (p.quantity || 1)) * 100));
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#0F172A]">{p.name}</span>
                  <span className="font-mono text-[#475569]">
                    <strong className="text-[#8C610A] font-bold">{p.winnersCount || 0}</strong> of {p.quantity} Winners Assigned ({pct}%)
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[#FAF8F5] border border-[#CBD5E1] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full transition-all shadow-sm"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State Breakdown */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#8C610A]" />
          <h3 className="text-lg font-bold text-[#0F172A] font-heading">Geographic Participation Breakdown</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data?.stateDistribution?.map((st, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] space-y-1">
              <span className="text-xs font-semibold text-[#64748B] block truncate">{st._id || 'Other'}</span>
              <span className="text-lg font-black font-mono text-[#8C610A]">{st.count} entries</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
