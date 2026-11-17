import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Crown,
  Award,
  Search,
  ShieldCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  Gift,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import posterImg from '../../assets/grand-lucky-draw-poster.jpg';

const WinnersPage = () => {
  const [data, setData] = useState({ categories: [], totalPublishedWinners: 0, campaign: null });
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await api.get('/winners/public');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('[Winners Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId || searchId.trim() === '') return;

    setSearching(true);
    setSearchResult(null);
    try {
      const res = await api.get(`/winners/check/${searchId.trim().toUpperCase()}`);
      if (res.data.success) {
        setSearchResult(res.data);
        if (res.data.isWinner) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#FFF0B8', '#B8860B']
          });
        }
      }
    } catch (err) {
      console.error('[Search Winner Error]', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-bold tracking-widest uppercase shadow-gold-glow">
          <Crown className="w-4 h-4 text-gold-400" />
          <span>Official Results Publication</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
          GRAND LUCKY DRAW <span className="text-gold-gradient">WINNERS</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          Official list of verified winners from the manual draw. All entries have been certified through two-step administrative approval.
        </p>

        <div className="inline-flex items-center gap-2 text-xs text-gold-400/90 bg-dark-900 border border-gold-500/20 px-4 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Draw Date: <strong>19 May 2027</strong> • 70 Grand Listed Prizes</span>
        </div>
      </div>

      {/* Participant ID Search Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Check Participant ID (e.g. LD2027-000001)"
            className="w-full px-5 py-4 pl-12 rounded-2xl bg-dark-900 border-2 border-gold-500/40 text-white font-mono text-sm sm:text-base placeholder:text-gray-500 focus:outline-none focus:border-gold-400 shadow-card-dark"
          />
          <Search className="w-5 h-5 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            disabled={searching}
            className="absolute right-2 top-2 bottom-2 px-5 rounded-xl btn-gold text-xs font-bold flex items-center gap-1.5"
          >
            {searching ? 'Checking...' : 'Check ID'}
          </button>
        </form>

        {/* Search Result Popup */}
        {searchResult && (
          <div className="mt-4 p-5 rounded-2xl bg-dark-900 border border-gold-500/40 animate-scale-up shadow-card-dark">
            {searchResult.isWinner ? (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/40 mx-auto flex items-center justify-center text-gold-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-xl font-bold text-gold-gradient font-heading">
                  CONGRATULATIONS! YOU ARE A WINNER!
                </div>
                <div className="text-sm text-gray-300">
                  Participant ID: <strong className="text-gold-300 font-mono">{searchResult.participantId}</strong>
                  <br />
                  Winner: <strong>{searchResult.maskedName}</strong> ({searchResult.city}, {searchResult.state})
                </div>
                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-sm font-bold">
                  Prize Won: {searchResult.prize.name} ({searchResult.prize.category})
                </div>
                <Link
                  to="/verify-winner"
                  className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold"
                >
                  <span>Proceed to Claim Your Prize</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <AlertCircle className="w-5 h-5 text-gray-500 shrink-0" />
                <span>
                  No winning record found for ID <strong className="text-white font-mono">{searchResult.participantId}</strong> in the published results.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Winners Showcase Grouped by Prize */}
      {loading ? (
        <div className="text-center py-20 text-gold-400 font-mono">Loading official results...</div>
      ) : data.categories.length === 0 ? (
        <div className="text-center p-12 rounded-3xl bg-dark-900 border border-gold-500/20 max-w-2xl mx-auto space-y-4">
          <Award className="w-12 h-12 text-gold-400 mx-auto opacity-70" />
          <h3 className="text-2xl font-bold text-white font-heading">Results Awaiting Publication</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            The official physical manual draw is scheduled for <strong>19 May 2027</strong>. Following completion of the draw and two-tier administrator verification, official winners will be published here.
          </p>
          <div className="pt-2">
            <Link to="/draw-information" className="btn-outline-gold inline-block px-5 py-2.5 rounded-xl text-xs font-bold">
              Learn About Draw Transparency
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {data.categories.map((categoryGroup, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-gradient-to-b from-[#14161F] to-[#0A0B0E] border border-gold-500/30 overflow-hidden shadow-card-dark"
            >
              {/* Prize Header */}
              <div className="p-6 sm:p-8 border-b border-gold-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-950/60">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black border border-gold-500/30 shrink-0">
                    <img
                      src={categoryGroup.prize.imageUrl || posterImg}
                      alt={categoryGroup.prize.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block">
                      {categoryGroup.prize.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      {categoryGroup.prize.name}
                    </h2>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-300 text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>{categoryGroup.winners.length} Official Winner{categoryGroup.winners.length !== 1 ? 's' : ''} Published</span>
                </div>
              </div>

              {/* Winners Table */}
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400">
                      <th className="py-3 px-4">Rank / Winner #</th>
                      <th className="py-3 px-4">Participant ID</th>
                      <th className="py-3 px-4">Winner Name (Privacy Masked)</th>
                      <th className="py-3 px-4">State & City</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-gray-200">
                    {categoryGroup.winners.map((win, wIdx) => (
                      <tr key={wIdx} className="hover:bg-gold-500/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-gold-400">
                          #{win.rank || wIdx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white tracking-wide">
                          {win.participantId}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-gray-100">
                          {win.maskedName}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">
                          {win.city}{win.city && win.state ? ', ' : ''}{win.state}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claim Instructions Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-gold-500/15 border border-gold-500/40 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white font-heading">
          ARE YOU ONE OF THE LUCKY WINNERS?
        </h3>
        <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
          If your participant ID appears on this official announcement list, proceed to our secure Winner Verification and Prize Claim portal using your registered mobile number to initiate distribution.
        </p>
        <div className="pt-2">
          <Link
            to="/verify-winner"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-gold-glow"
          >
            <span>Open Winner Verification & Claim Portal</span>
            <ExternalLink className="w-4 h-4 text-dark-950" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WinnersPage;
