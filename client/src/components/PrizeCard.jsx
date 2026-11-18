import React from 'react';
import { Award, Check, Sparkles } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

const PrizeCard = ({ prize, onSelect }) => {
  const { name, category, quantity, description, imageUrl, features } = prize;

  return (
    <div className="bg-white rounded-3xl overflow-hidden group flex flex-col justify-between border border-[#E8EAF0] hover:border-[#D4AF37] shadow-card-light hover:shadow-card-hover transition-all duration-300 relative">
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-[#F1ECE1] flex items-center justify-center border-b border-[#E8EAF0]">
          <img
            src={resolveImageUrl(imageUrl)}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

          {/* Top Quantity Pill */}
          <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full bg-[#FAF7EE]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-sm flex items-center gap-1.5 text-xs font-extrabold text-[#8C610A]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{quantity} {quantity === 1 ? 'Prize' : 'Prizes'} Available</span>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3.5 left-3.5 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-[#D4AF37]/40 text-[11px] font-black text-[#8C610A] uppercase tracking-wider shadow-xs font-display">
            {category}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6">
          <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] font-heading tracking-tight mb-2 group-hover:text-[#B8860B] transition-colors">
            {name}
          </h3>
          <p className="text-sm text-[#5A657D] line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>

          {/* Feature Bullets */}
          {features && features.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-[#E8EAF0]">
              {features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#0F172A] font-medium">
                  <div className="w-4 h-4 rounded-full bg-[#18865B]/10 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#18865B]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0">
        <button
          onClick={() => onSelect && onSelect(prize)}
          className="w-full py-3 px-4 rounded-xl btn-outline-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 group-hover:bg-[#FAF7EE] group-hover:border-[#B8860B] transition-all"
        >
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>View Prize Specifications</span>
        </button>
      </div>
    </div>
  );
};

export default PrizeCard;
