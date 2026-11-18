import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Gift, Sparkles, Filter, ArrowRight } from 'lucide-react';
import PrizeCard from '../../components/PrizeCard';
import api from '../../services/api';
import posterImg from '../../assets/grand-lucky-draw-poster.jpg';
import { resolveImageUrl, handleImageError } from '../../utils/imageHelper';

const PrizesPage = () => {
  const [prizes, setPrizes] = useState([]);
  const [filteredPrizes, setFilteredPrizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const res = await api.get('/prizes');
        if (res.data.success) {
          setPrizes(res.data.data);
          setFilteredPrizes(res.data.data);
        }
      } catch (err) {
        console.error('[Prizes Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrizes();
  }, []);

  const categories = [
    { label: 'All 70 Prizes', value: 'ALL' },
    { label: 'Luxury SUVs', value: 'SUV' },
    { label: 'Cars', value: 'CAR' },
    { label: 'Electric Scooters', value: 'TWO_WHEELER' },
    { label: 'Real Estate Estate', value: 'REAL_ESTATE' }
  ];

  const handleFilter = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'ALL') {
      setFilteredPrizes(prizes);
    } else {
      setFilteredPrizes(prizes.filter((p) => p.category === cat));
    }
  };

  const totalUnits = prizes.reduce((sum, p) => sum + (p.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
          <Crown className="w-4 h-4 text-[#D6A63A]" />
          <span>70 Life-Changing Rewards</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-[#172033]">
          PRIZE <span className="text-gold-gradient">CATALOGUE</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
          Discover the complete lineup of 70 grand prizes up for grabs in the Grand Lucky Draw 2027.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#172033] pt-2">
          <span className="px-3 py-1 rounded-lg bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708]">4x Toyota Fortuners</span>
          <span className="px-3 py-1 rounded-lg bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708]">5x Mahindra Thars</span>
          <span className="px-3 py-1 rounded-lg bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708]">20x Maruti Swifts</span>
          <span className="px-3 py-1 rounded-lg bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708]">40x Electric Scooters</span>
          <span className="px-3 py-1 rounded-lg bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708]">1x Luxury Farmhouse</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => handleFilter(c.value)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
              selectedCategory === c.value
                ? 'bg-gradient-to-r from-[#DFBA5E] to-[#D6A63A] text-[#172033] shadow-gold-glow'
                : 'bg-white border border-[#E8EAF0] text-[#667085] hover:text-[#172033] hover:border-[#D6A63A]/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Prizes Grid */}
      {loading ? (
        <div className="text-center py-20 text-[#B8860B] font-bold">Loading prize catalogue...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrizes.map((prize) => (
            <PrizeCard
              key={prize._id}
              prize={prize}
              onSelect={(p) => setSelectedPrize(p)}
            />
          ))}
        </div>
      )}

      {/* Bottom CTA Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8EAF0] shadow-card-light text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black font-heading text-[#172033]">
          WANT A CHANCE TO WIN THESE GRAND PRIZES?
        </h3>
        <p className="text-sm text-[#667085] max-w-xl mx-auto">
          Participation is simple, quick, and verified. Register with your mobile number to get your unique participant ID.
        </p>
        <Link
          to="/register"
          className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm shadow-gold-glow"
        >
          <Sparkles className="w-5 h-5 text-[#172033]" />
          <span>Register for Free Entry</span>
          <ArrowRight className="w-5 h-5 text-[#172033]" />
        </Link>
      </div>

      {/* Modal */}
      {selectedPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E8EAF0] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-4">
              <div className="text-xl font-black text-[#172033] font-heading">{selectedPrize.name}</div>
              <button
                onClick={() => setSelectedPrize(null)}
                className="text-[#667085] hover:text-[#172033] p-1.5 rounded-lg hover:bg-gray-100 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="h-52 rounded-2xl overflow-hidden bg-[#F4F6FA] border border-[#E8EAF0]">
              <img
                src={resolveImageUrl(selectedPrize.imageUrl)}
                alt={selectedPrize.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <p className="text-sm text-[#667085] leading-relaxed">{selectedPrize.description}</p>
            {selectedPrize.features && selectedPrize.features.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-[#946708] tracking-wider">Specifications:</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPrize.features.map((f, i) => (
                    <div key={i} className="text-xs text-[#172033] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#18865B]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPrize(null)}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrizesPage;
