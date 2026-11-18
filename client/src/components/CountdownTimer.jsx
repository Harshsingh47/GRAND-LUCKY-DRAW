import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate = '2027-05-19T10:00:00.000Z', label = 'Draw Date Countdown' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') }
  ];

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-center gap-2 mb-3 text-xs tracking-widest uppercase font-black text-[#8C610A] font-display">
          <Clock className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span>{label}</span>
        </div>
      )}

      {timeLeft.isCompleted ? (
        <div className="text-center p-4 rounded-xl bg-[#FAF7EE] border border-[#D4AF37]/50 text-[#8C610A] font-bold tracking-wide">
          Official Draw Event Underway! Check published results.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="relative group p-3 sm:p-5 rounded-2xl bg-gradient-to-b from-white to-[#FDFBF7] border border-[#E8EAF0] text-center shadow-card-light hover:border-[#D4AF37] hover:shadow-card-hover transition-all overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
              <div className="text-2xl sm:text-4xl md:text-5xl font-black font-heading text-[#0F172A] tracking-tight group-hover:text-[#8C610A] transition-colors">
                {unit.value}
              </div>
              <div className="text-[10px] sm:text-xs font-black tracking-widest text-[#8C610A] uppercase mt-1 font-display">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
