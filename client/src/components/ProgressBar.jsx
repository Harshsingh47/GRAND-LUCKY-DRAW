import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

const ProgressBar = ({ current = 0, target = 10000, label = 'Campaign Registration Progress' }) => {
  const percentage = Math.min(100, Math.round((current / (target || 1)) * 100));

  return (
    <div className="w-full p-5 sm:p-6 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#D6A63A]">
            <Users className="w-5 h-5 text-[#B8860B]" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#B8860B] font-bold">{label}</h4>
            <div className="text-lg sm:text-2xl font-black text-[#172033] font-heading">
              <span className="text-[#B8860B]">{current.toLocaleString()}</span>
              <span className="text-[#667085] text-base sm:text-lg font-medium"> / {target.toLocaleString()} Participants</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18865B]/10 border border-[#18865B]/20 text-[#18865B] text-xs font-bold self-end sm:self-auto">
          <TrendingUp className="w-4 h-4 text-[#18865B]" />
          <span>{percentage}% Target Reached</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-3.5 bg-[#F1F3F7] rounded-full overflow-hidden p-0.5 border border-[#E8EAF0]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#DFBA5E] via-[#D6A63A] to-[#B8860B] transition-all duration-1000 ease-out shadow-xs"
          style={{ width: `${Math.max(3, percentage)}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-[#667085] mt-2 font-medium">
        <span>0</span>
        <span className="text-[#172033] font-semibold">Target Goal: {target.toLocaleString()} Entries</span>
        <span>{target.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
