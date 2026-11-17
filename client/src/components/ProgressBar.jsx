import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

const ProgressBar = ({ current = 0, target = 10000, label = 'Campaign Registration Progress' }) => {
  const percentage = Math.min(100, Math.round((current / (target || 1)) * 100));

  return (
    <div className="w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#14161F] to-[#0A0B0E] border border-gold-500/30 shadow-card-dark">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold">{label}</h4>
            <div className="text-lg sm:text-xl font-bold text-white font-mono">
              <span className="text-gold-300 font-extrabold">{current.toLocaleString()}</span>
              <span className="text-gray-500"> / {target.toLocaleString()} Participants</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold self-end sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
          <span>{percentage}% Target Reached</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-4 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-gold-500/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-yellow-200 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(212,175,55,0.6)]"
          style={{ width: `${Math.max(3, percentage)}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2 font-mono">
        <span>0</span>
        <span className="text-gray-400">Target Goal: {target.toLocaleString()} Entries</span>
        <span>{target.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
