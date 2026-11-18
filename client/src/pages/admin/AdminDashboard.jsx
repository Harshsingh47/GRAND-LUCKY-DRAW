import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Gift,
  Award,
  Lock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/campaigns/stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
        }
      } catch (err) {
        console.error('[Admin Dashboard Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-gold-400 font-mono">Loading campaign intelligence...</div>;
  }

  const statCards = [
    { label: 'Total Registered', value: stats?.totalRegistered || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Mobile Verified', value: stats?.verifiedParticipants || 0, icon: UserCheck, color: 'text-emerald-400' },
    { label: 'Pending Registrations', value: stats?.pendingRegistrations || 0, icon: Clock, color: 'text-yellow-400' },
    { label: 'Eligible for Draw', value: stats?.eligibleParticipants || 0, icon: ShieldCheck, color: 'text-gold-400' },
    { label: 'Disqualified', value: stats?.disqualifiedParticipants || 0, icon: UserX, color: 'text-red-400' },
    { label: 'Total Grand Prizes', value: stats?.totalPrizes || 70, icon: Gift, color: 'text-purple-400' },
    { label: 'Winners Assigned', value: stats?.totalWinners || 0, icon: Award, color: 'text-amber-400' },
    { label: 'Published Winners', value: stats?.publishedWinners || 0, icon: CheckSquare, color: 'text-green-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#172033]">
            CAMPAIGN <span className="text-gold-gradient">OVERVIEW</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Real-time telemetry and management controls for Grand Lucky Draw 2027.
          </p>
        </div>

        {/* Current Draw Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#667085] font-mono">Campaign State:</span>
          <span className="px-3 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] font-mono font-bold text-xs">
            {stats?.campaignStatus || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Manual Draw Alert Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#FAF7EE] text-[#D6A63A] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172033] font-heading">
              Manual Draw Management Protocol
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Official draw is conducted physically outside the system. When registrations close, freeze the participant list in Step 2 to generate the cryptographic SHA-256 hash.
            </p>
          </div>
        </div>
        <Link
          to="/admin/draw-management"
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm"
        >
          Manage Draw Stages →
        </Link>
      </div>

      {/* 8 Stat Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-[#E8EAF0] hover:border-[#D6A63A]/40 transition-all space-y-2 shadow-card-light"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#172033]">
                {card.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Panel */}
        <div className="bg-white border border-[#E8EAF0] rounded-3xl p-6 space-y-4 shadow-card-light">
          <h3 className="text-base font-bold text-[#172033] font-heading">Quick Administrative Actions</h3>
          <div className="space-y-2.5">
            <Link
              to="/admin/draw-management"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] hover:border-[#D6A63A]/50 text-xs font-semibold text-[#172033] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#D6A63A]" />
                <span>Close Registration & Freeze List</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
            </Link>

            <Link
              to="/admin/enter-winners"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] hover:border-[#D6A63A]/50 text-xs font-semibold text-[#172033] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-[#D6A63A]" />
                <span>Enter Manual Winners</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
            </Link>

            <Link
              to="/admin/winner-approvals"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] hover:border-[#D6A63A]/50 text-xs font-semibold text-[#172033] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-[#D6A63A]" />
                <span>Two-Person Approvals Queue</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
            </Link>

            <Link
              to="/admin/winners"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] hover:border-[#D6A63A]/50 text-xs font-semibold text-[#172033] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#D6A63A]" />
                <span>Publish Official Results</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
            </Link>

            <Link
              to="/admin/participants"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] hover:border-[#D6A63A]/50 text-xs font-semibold text-[#172033] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#D6A63A]" />
                <span>Export Participants (Excel / CSV)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#667085]" />
            </Link>
          </div>
        </div>

        {/* State Breakdown Card */}
        <div className="lg:col-span-2 bg-white border border-[#E8EAF0] rounded-3xl p-6 space-y-4 shadow-card-light">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172033] font-heading">Top Participant Regions</h3>
            <span className="text-xs text-[#946708] font-mono">Geographic Distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {charts?.stateBreakdown && charts.stateBreakdown.length > 0 ? (
              charts.stateBreakdown.map((item, idx) => {
                const max = charts.stateBreakdown[0]?.count || 1;
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#172033]">{item._id || 'Unspecified'}</span>
                      <span className="text-[#946708] font-mono">{item.count} entries</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F1F3F7] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D6A63A] to-[#B8860B] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#667085]">No regional data recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
