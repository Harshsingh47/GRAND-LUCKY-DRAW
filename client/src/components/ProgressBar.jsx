import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

const ProgressBar = ({ current = 0, target = 10000, label = 'Campaign Registration Progress' }) => {
  const percentage = Math.min(100, Math.round((current / (target || 1)) * 100));

  return (
    <div className="w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white to-[#FDFBF7] border border-[#E8EAF0] shadow-card-light hover:border-[#D4AF37]/50 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FAF7EE] to-[#F3E5C1] border border-[#D4AF37]/40 shadow-xs flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#8C610A]" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C610A] font-black font-display">{label}</h4>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] font-heading">
              <span className="text-[#8C610A]">{current.toLocaleString()}</span>
              <span className="text-[#5A657D] text-base sm:text-lg font-medium"> / {target.toLocaleString()} Participants</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18865B]/10 border border-[#18865B]/30 text-[#18865B] text-xs font-bold self-end sm:self-auto shadow-xs">
          <TrendingUp className="w-4 h-4 text-[#18865B]" />
          <span>{percentage}% Target Reached</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-4 bg-[#F5F1E8] rounded-full overflow-hidden p-0.5 border border-[#E8EAF0]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#F0C75E] via-[#D8A738] to-[#B88214] transition-all duration-1000 ease-out shadow-xs"
          style={{ width: `${Math.max(3, percentage)}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-[#5A657D] mt-2.5 font-medium">
        <span>0</span>
        <span className="text-[#0F172A] font-bold">Target Goal: {target.toLocaleString()} Entries</span>
        <span>{target.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
