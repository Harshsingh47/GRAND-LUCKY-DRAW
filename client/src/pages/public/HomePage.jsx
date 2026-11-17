import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  HelpCircle,
  Megaphone,
  ChevronDown,
  Gift
} from 'lucide-react';
import CountdownTimer from '../../components/CountdownTimer';
import ProgressBar from '../../components/ProgressBar';
import PrizeCard from '../../components/PrizeCard';
import api from '../../services/api';
import posterImg from '../../assets/grand-lucky-draw-poster.jpg';
import { resolveImageUrl, handleImageError } from '../../utils/imageHelper';

const HomePage = () => {
  const [campaign, setCampaign] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedPrize, setSelectedPrize] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [campRes, prizeRes, annRes] = await Promise.all([
          api.get('/campaigns/active'),
          api.get('/prizes'),
          api.get('/announcements')
        ]);

        if (campRes.data.success) setCampaign(campRes.data.data);
        if (prizeRes.data.success) setPrizes(prizeRes.data.data);
        if (annRes.data.success) setAnnouncements(annRes.data.data);
      } catch (err) {
        console.error('[Home Data Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const faqs = [
    {
      q: 'How are winners selected in the Grand Lucky Draw?',
      a: 'The draw is conducted 100% manually and physically by the organizers outside the platform in front of independent verification committees and legal witnesses. The website does NOT use computer algorithms or random number generators. The final eligible participant list is cryptographically frozen before the physical draw.'
    },
    {
      q: 'How many grand prizes are being awarded?',
      a: 'A total of 70 listed grand prizes are being awarded in this campaign: 4 Toyota Fortuner 4x4 SUVs, 5 Mahindra Thar 4x4s, 20 Maruti Suzuki Swift cars, 40 Electric Scooters, and 1 Luxury Farmhouse estate.'
    },
    {
      q: 'How do I know my registration is confirmed?',
      a: 'Upon successful mobile OTP verification, you are immediately assigned a unique sequential Participant ID (e.g., LD2027-000001) and a digital participation pass. A confirmation SMS will also be sent to your registered mobile number.'
    },
    {
      q: 'When does registration start and when will the draw take place?',
      a: 'Registrations begin on 1 December and close on 15 May. The official physical draw will be conducted on 19 May.'
    },
    {
      q: 'How can I check if I won?',
      a: 'Once the manual draw is concluded and verified through dual-administrator approval, official results are published on the website. You can view all winners under "Official Winners" or use the "Verify & Claim" tool with your Participant ID.'
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* SECTION A: HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-gold-500/20 border border-gold-500/30 text-gold-300 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-gold-glow">
              <Crown className="w-4 h-4 text-gold-400" />
              <span>Official Campaign</span>
              <Sparkles className="w-4 h-4 text-gold-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-tight text-white leading-none">
              GRAND <span className="text-gold-gradient text-gold-glow">LUCKY DRAW</span>
            </h1>

            {/* Tagline */}
            <p className="text-2xl sm:text-3xl font-serif italic text-gold-200 tracking-wide">
              "Dream Big... Win Big..."
            </p>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your chance to win 70 life-changing grand prizes including 4 Toyota Fortuners, 5 Mahindra Thars, 20 Swift Cars, 40 Electric Scooters, and a Luxury Farmhouse!
            </p>

            {/* Key Meta Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="px-4 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 text-gray-200">
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Joining: <strong>1 December</strong></span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 text-gray-200">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>Official Draw: <strong>19 May</strong></span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs sm:text-sm font-semibold flex items-center gap-2 text-gray-200">
                <Users className="w-4 h-4 text-gold-400" />
                <span>Target: <strong>10,000 Participants</strong></span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="btn-gold w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-gold-glow-lg group"
              >
                <Sparkles className="w-5 h-5 text-dark-950 group-hover:rotate-12 transition-transform" />
                <span>Join Now & Register Free</span>
                <ArrowRight className="w-5 h-5 text-dark-950 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/prizes"
                className="btn-outline-gold w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5 text-gold-400" />
                <span>Explore 70 Grand Prizes</span>
              </Link>
            </div>
          </div>

          {/* Promotional Poster Showcase Card */}
          <div className="mt-12 sm:mt-16 rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-card-dark relative group">
            <img
              src={posterImg}
              alt="Grand Lucky Draw Official Campaign Poster"
              className="w-full h-auto object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-60" />
          </div>

          {/* Countdown Timer Container */}
          <div className="mt-12 max-w-3xl mx-auto">
            <CountdownTimer
              targetDate={campaign?.drawDate || '2027-05-19T10:00:00.000Z'}
              label="Official Draw Countdown • 19 May"
            />
          </div>
        </div>
      </section>

      {/* SECTION B: REGISTRATION PROGRESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar
          current={campaign?.currentParticipants || 25}
          target={campaign?.targetParticipants || 10000}
          label="Live Registration Counter"
        />
      </section>

      {/* SECTION C: GRAND PRIZES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-xs font-semibold text-gold-400 uppercase tracking-widest">
            <Award className="w-4 h-4 text-gold-400" />
            <span>70 Listed Grand Rewards</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white">
            GRAND <span className="text-gold-gradient">PRIZES</span> SHOWCASE
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Every eligible verified participant has an equal chance to win. All prizes are physical and will be awarded under legal supervision.
          </p>
        </div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prizes.map((prize) => (
            <PrizeCard
              key={prize._id}
              prize={prize}
              onSelect={(p) => setSelectedPrize(p)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/prizes"
            className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          >
            <span>View Complete 70-Prize Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION D: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#14161F] to-[#0A0B0E] border border-gold-500/30">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-xs font-semibold text-gold-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Simple 6-Step Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              HOW IT <span className="text-gold-gradient">WORKS</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Follow these simple steps to participate in the Grand Lucky Draw.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Register on Website',
                desc: 'Fill in your basic personal information including full name, state, and city on the secure registration form.'
              },
              {
                step: '02',
                title: 'Direct Identification',
                desc: 'Enter your valid 10-digit mobile number for immediate identification with duplicate prevention.'
              },
              {
                step: '03',
                title: 'Complete Requirements',
                desc: 'Agree to the terms and verify your eligibility requirements in compliance with campaign rules.'
              },
              {
                step: '04',
                title: 'Receive Unique ID',
                desc: 'Your concurrency-safe sequential Participant ID (e.g. LD2027-000001) and digital pass are instantly generated.'
              },
              {
                step: '05',
                title: 'Wait for Official Draw',
                desc: 'The organizers conduct the physical manual draw independently outside the platform with complete transparency.'
              },
              {
                step: '06',
                title: 'Check Published Winners',
                desc: 'Dual-approved official winners are published on the website. Verify your ID and submit your prize claim.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-dark-950/80 border border-gold-500/20 hover:border-gold-500/50 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-lg font-black font-mono text-gold-400">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white font-heading">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/register"
              className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-gold-glow"
            >
              <span>Get Started Now — Register</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION E: DRAW INFORMATION & TRANSPARENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-xs font-semibold text-gold-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Integrity & Fairness Guarantee</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white leading-tight">
              100% MANUAL DRAW <br />
              <span className="text-gold-gradient">ZERO COMPUTER ALGORITHMS</span>
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              The Grand Lucky Draw follows a strict physical manual draw protocol. The platform never automatically picks random winners. Organizers conduct the manual draw independently in front of cameras and observers.
            </p>
            <div className="space-y-3">
              {[
                'Cryptographic participant list freezing with public SHA-256 hash',
                'Physical offline manual draw conducted by independent observers',
                'Two-person administrative approval workflow preventing self-approval',
                'Masked public winner announcement protecting participant privacy'
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link
                to="/draw-information"
                className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              >
                <span>Read Full Draw Methodology</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-gold-500/30 space-y-6 shadow-card-dark">
            <h3 className="text-xl font-bold text-white font-heading text-gold-gradient">
              Key Campaign Dates & Details
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gray-800">
                <span className="text-gray-400">Joining Start Date</span>
                <span className="font-bold text-gold-300 font-mono">1 December 2026</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gray-800">
                <span className="text-gray-400">Registration Closing Date</span>
                <span className="font-bold text-gray-200 font-mono">15 May 2027</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gray-800">
                <span className="text-gray-400">Official Draw Date</span>
                <span className="font-bold text-gold-400 font-mono text-base">19 May 2027</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gray-800">
                <span className="text-gray-400">Target Participants</span>
                <span className="font-bold text-white font-mono">10,000 Verified</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-950 border border-gray-800">
                <span className="text-gray-400">Campaign Organization</span>
                <span className="font-bold text-white">Grand Lucky Draw Committee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: LATEST ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-gold-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                LATEST <span className="text-gold-gradient">ANNOUNCEMENTS</span>
              </h2>
            </div>
            <Link to="/about" className="text-xs text-gold-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann._id}
                className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="text-gold-400 font-semibold uppercase">{ann.category}</span>
                    <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{ann.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{ann.content}</p>
                </div>
                <div className="pt-4 text-xs text-gold-400 font-medium">
                  Official Communication • Draw Committee
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION G: FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-xs font-semibold text-gold-400 uppercase tracking-widest">
            <HelpCircle className="w-4 h-4 text-gold-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
            FREQUENTLY ASKED <span className="text-gold-gradient">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-dark-900 border border-gold-500/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-medium hover:text-gold-300"
              >
                <span className="font-heading text-base sm:text-lg">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-400 shrink-0 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-gray-300 leading-relaxed border-t border-gray-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Prize Specification Modal */}
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
                src={resolveImageUrl(selectedPrize.imageUrl)}
                alt={selectedPrize.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{selectedPrize.description}</p>
            {selectedPrize.features && selectedPrize.features.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-gold-400 tracking-wider">Key Specifications:</span>
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

export default HomePage;
