import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Gift, Sparkles, Filter, ArrowRight } from 'lucide-react';
import PrizeCard from '../../components/PrizeCard';
import api from '../../services/api';
import posterImg from '../../assets/grand-lucky-draw-poster.jpg';

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-bold tracking-widest uppercase shadow-gold-glow">
          <Crown className="w-4 h-4 text-gold-400" />
          <span>70 Life-Changing Rewards</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
          PRIZE <span className="text-gold-gradient">CATALOGUE</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          Discover the complete lineup of 70 grand prizes up for grabs in the Grand Lucky Draw 2027 by Independent Medias.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-gold-300 pt-2 font-mono">
          <span>• 4x Toyota Fortuners</span>
          <span>• 5x Mahindra Thars</span>
          <span>• 20x Maruti Swifts</span>
          <span>• 40x Electric Scooters</span>
          <span>• 1x Luxury Farmhouse</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => handleFilter(c.value)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === c.value
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 shadow-gold-glow'
                : 'bg-dark-900 border border-gold-500/20 text-gray-400 hover:text-white hover:border-gold-500/40'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Prizes Grid */}
      {loading ? (
        <div className="text-center py-20 text-gold-400 font-mono">Loading prize catalogue...</div>
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
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-gold-500/30 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
          WANT A CHANCE TO WIN THESE GRAND PRIZES?
        </h3>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Participation is simple, quick, and verified. Register with your mobile number to get your unique participant ID.
        </p>
        <Link
          to="/register"
          className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm shadow-gold-glow"
        >
          <Sparkles className="w-5 h-5 text-dark-950" />
          <span>Register for Free Entry</span>
          <ArrowRight className="w-5 h-5 text-dark-950" />
        </Link>
      </div>

      {/* Modal */}
      {selectedPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0F1015] border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="text-xl font-bold text-gold-gradient font-heading">{selectedPrize.name}</div>
              <button
                onClick={() => setSelectedPrize(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="h-48 rounded-xl overflow-hidden bg-black">
              <img
                src={selectedPrize.imageUrl || posterImg}
                alt={selectedPrize.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{selectedPrize.description}</p>
            {selectedPrize.features && selectedPrize.features.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-gold-400 tracking-wider">Specifications:</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPrize.features.map((f, i) => (
                    <div key={i} className="text-xs text-gray-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
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
