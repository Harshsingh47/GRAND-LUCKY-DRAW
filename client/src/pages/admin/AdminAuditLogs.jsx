import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminAuditLogs = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [actionFilter, setActionFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const actions = [
    'ALL',
    'USER_LOGIN',
    'REGISTRATION_CLOSE',
    'PARTICIPANTS_FROZEN',
    'PARTICIPANT_DISQUALIFIED',
    'WINNER_ENTERED',
    'WINNER_APPROVED',
    'WINNER_REJECTED',
    'WINNERS_PUBLISHED',
    'WINNERS_UNPUBLISHED',
    'PRIZE_CLAIM_UPDATED',
    'CAMPAIGN_UPDATE'
  ];

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20'
      });
      if (actionFilter !== 'ALL') params.append('action', actionFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/audit-logs?${params.toString()}`);
      if (res.data.success) {
        setLogs(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast('Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [actionFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
          SYSTEM <span className="text-gold-gradient">AUDIT TRAIL</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Immutable forensic log of all administrative actions, list freezing, approvals, and security events.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Action Type:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#CBD5E1] text-xs text-[#0F172A] font-bold focus:outline-none focus:border-[#8C610A]"
          >
            {actions.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchLogs(1); }} className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description or actor..."
            className="w-full px-3.5 py-1.5 pl-8 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#8C610A]"
          />
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Logs Table */}
      <div className="luxury-card rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-black uppercase tracking-wider text-[#475569] bg-[#FAF8F5]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C610A] font-mono font-bold">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748B]">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#64748B] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-50 text-[#8C610A] border border-amber-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                      {log.actorName}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] text-[#475569] font-mono font-bold">
                      {log.actorRole}
                    </td>
                    <td className="py-3.5 px-4 text-[#334155] max-w-xs truncate font-medium">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#64748B] text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1 rounded text-[#8C610A] hover:text-[#5E4204] hover:bg-amber-50"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] bg-[#FAF8F5]">
          <div>
            Showing {(pagination.page - 1) * pagination.limit + (logs.length > 0 ? 1 : 0)} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLogs(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-[#CBD5E1] text-[#334155] bg-white disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[#8C610A] font-bold">
              Page {pagination.page} of {pagination.pages || 1}
            </span>
            <button
              onClick={() => fetchLogs(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-1.5 rounded-lg border border-[#CBD5E1] text-[#334155] bg-white disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-bold text-[#0F172A] font-heading">Audit Entry Details</h3>
              <button onClick={() => setSelectedLog(null)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] space-y-1">
                <span className="text-[#64748B] font-sans">Action:</span>
                <span className="text-[#8C610A] font-bold block">{selectedLog.action}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] space-y-1">
                <span className="text-[#64748B] font-sans">Description:</span>
                <p className="text-[#0F172A] font-sans font-medium">{selectedLog.description}</p>
              </div>
              {selectedLog.details && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] space-y-1">
                  <span className="text-[#64748B] font-sans">Structured Payload / Metadata:</span>
                  <pre className="text-[11px] text-[#0F172A] overflow-x-auto p-2 bg-white border border-[#CBD5E1] rounded">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="btn-gold px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
