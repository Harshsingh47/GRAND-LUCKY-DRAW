import React from 'react';
import { Award, Check, Sparkles } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

const PrizeCard = ({ prize, onSelect }) => {
  const { name, category, quantity, description, imageUrl, features } = prize;

  return (
    <div className="luxury-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-gold-500/60 transition-all duration-300">
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-dark-950 flex items-center justify-center border-b border-gold-500/20">
          <img
            src={resolveImageUrl(imageUrl)}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D11] via-transparent to-black/30" />

          {/* Top Quantity Pill */}
          <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gold-500/50 shadow-gold-glow flex items-center gap-1.5 text-xs font-bold text-gold-300">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{quantity} {quantity === 1 ? 'Prize' : 'Prizes'} Available</span>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-gold-500/20 backdrop-blur-md border border-gold-500/30 text-[11px] font-semibold text-gold-200 uppercase tracking-wider">
            {category}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-wide mb-2 group-hover:text-gold-300 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>

          {/* Feature Bullets */}
          {features && features.length > 0 && (
            <div className="space-y-1.5 pt-3 border-t border-gray-800/80">
              {features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-gold-400" />
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
          className="w-full py-2.5 px-4 rounded-xl btn-outline-gold text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 text-gold-400" />
          <span>View Prize Specifications</span>
        </button>
      </div>
    </div>
  );
};

export default PrizeCard;
