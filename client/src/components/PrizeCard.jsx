import React from 'react';
import { Award, Check, Sparkles, ArrowRight } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

const PrizeCard = ({ prize, onSelect }) => {
  const { name, category, quantity, description, imageUrl, features } = prize;

  return (
    <div className="bg-white rounded-2xl overflow-hidden group flex flex-col justify-between border border-[#E8EAF0] hover:border-[#D4AF37] shadow-card-light hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative">
      <div>
        {/* Compact Image Container with Studio Frame */}
        <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F6F3EB] to-[#EFEAE0] flex items-center justify-center p-3 border-b border-[#E8EAF0]/80">
          <img
            src={resolveImageUrl(imageUrl, name)}
            alt={name}
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

          {/* Top Quantity Pill */}
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#FAF7EE]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-xs flex items-center gap-1 text-[11px] font-black text-[#8C610A] font-heading">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{quantity} {quantity === 1 ? 'Prize' : 'Units'}</span>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md border border-[#D4AF37]/35 text-[10px] font-black text-[#8C610A] uppercase tracking-wider shadow-xs font-display">
            {category}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="text-base sm:text-lg font-black text-[#0F172A] font-heading tracking-tight leading-snug group-hover:text-[#B8860B] transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-[#5A657D] line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Feature Bullets */}
          {features && features.length > 0 && (
            <div className="space-y-1.5 pt-2.5 border-t border-[#E8EAF0]/80">
              {features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#0F172A] font-medium truncate">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#18865B]/10 flex items-center justify-center shrink-0">
                    <Check className="w-2 h-2 text-[#18865B]" />
                  </div>
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <button
          onClick={() => onSelect && onSelect(prize)}
          className="w-full py-2.5 px-3 rounded-xl btn-outline-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 group-hover:bg-[#FAF7EE] group-hover:border-[#B8860B] transition-all"
        >
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>View Specs</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8C610A] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PrizeCard;
