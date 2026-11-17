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
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
          SYSTEM <span className="text-gold-gradient">AUDIT TRAIL</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Immutable forensic log of all administrative actions, list freezing, approvals, and security events.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Action Type:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-dark-950 border border-gray-800 text-xs text-white"
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
            className="w-full px-3.5 py-1.5 pl-8 rounded-xl bg-dark-950 border border-gray-800 text-white text-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Logs Table */}
      <div className="luxury-card rounded-2xl overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-dark-950/80">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gold-400 font-mono">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gold-500/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-gold-500/10 text-gold-300 border border-gold-500/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {log.actorName}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] text-gray-400 font-mono">
                      {log.actorRole}
                    </td>
                    <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                      {log.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1 rounded text-gold-400 hover:text-gold-300 hover:bg-white/5"
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
        <div className="p-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div>
            Showing {(pagination.page - 1) * pagination.limit + (logs.length > 0 ? 1 : 0)} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLogs(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-gray-800 text-gray-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-gold-400">
              Page {pagination.page} of {pagination.pages || 1}
            </span>
            <button
              onClick={() => fetchLogs(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-1.5 rounded-lg border border-gray-800 text-gray-300 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0F1015] border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">Audit Entry Details</h3>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-dark-950 border border-gray-800 space-y-1">
                <span className="text-gray-500">Action:</span>
                <span className="text-gold-300 font-bold block">{selectedLog.action}</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-950 border border-gray-800 space-y-1">
                <span className="text-gray-500">Description:</span>
                <p className="text-white font-sans">{selectedLog.description}</p>
              </div>
              {selectedLog.details && (
                <div className="p-3 rounded-xl bg-dark-950 border border-gray-800 space-y-1">
                  <span className="text-gray-500">Structured Payload / Metadata:</span>
                  <pre className="text-[11px] text-gray-300 overflow-x-auto p-2 bg-black rounded">
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
