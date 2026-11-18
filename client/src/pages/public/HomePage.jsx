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
import HeroCarousel from '../../components/HeroCarousel';
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
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* SECTION A: HERO SECTION (Split 2-Column Layout) */}
      <section className="relative pt-6 pb-12 md:pt-14 md:pb-24">
        {/* Soft background ambient warmth & golden radiance */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#F3E5C1]/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Headlines, CTAs & Key Stats */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Campaign Status Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-gold text-xs font-black uppercase tracking-widest shadow-xs">
                  <Crown className="w-4 h-4 text-[#8C610A]" />
                  <span className="font-display">OFFICIAL CAMPAIGN 2027</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#8C610A]" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18865B]/10 border border-[#18865B]/30 text-[#18865B] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#18865B]" />
                  <span>100% Offline Manual Draw</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <div className="text-xs sm:text-sm uppercase tracking-[0.3em] font-display font-black text-[#9E7012] flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"></span>
                  <span>EXCLUSIVE LOTTERY GALA</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight text-[#0F172A] leading-[1.05]">
                  DREAM BIG. <br />
                  <span className="text-gold-gradient text-gold-glow">WIN BIG.</span>
                </h1>
                <p className="text-xl sm:text-2xl font-black text-[#8C610A] font-heading flex items-center gap-2">
                  <span>Grand Lucky Draw 2027</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7EE] border border-[#D4AF37]/40 text-[#8C610A] font-bold">
                    70 Grand Rewards
                  </span>
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#5A657D] leading-relaxed max-w-xl font-normal">
                Your opportunity to win 70 life-changing grand rewards including 4 Toyota Fortuners, 5 Mahindra Thars, 20 Swift Cars, 40 Electric Scooters, and a Luxury Farmhouse!
              </p>

              {/* Key Meta Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light hover:border-[#D4AF37]/50 hover:shadow-card-hover transition-all flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF7EE] to-[#F3E5C1] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4 text-[#8C610A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#5A657D] font-bold block font-display">Joining</span>
                    <span className="text-sm sm:text-base font-black text-[#0F172A] font-heading">1 December</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light hover:border-[#D4AF37]/50 hover:shadow-card-hover transition-all flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF7EE] to-[#F3E5C1] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4 text-[#8C610A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#5A657D] font-bold block font-display">Official Draw</span>
                    <span className="text-sm sm:text-base font-black text-[#8C610A] font-heading">19 May</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light hover:border-[#D4AF37]/50 hover:shadow-card-hover transition-all flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF7EE] to-[#F3E5C1] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4 text-[#8C610A]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#5A657D] font-bold block font-display">Target</span>
                    <span className="text-sm sm:text-base font-black text-[#0F172A] font-heading">10,000 Seats</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="btn-gold px-9 py-4 rounded-2xl text-base font-black tracking-wide flex items-center justify-center gap-2.5 shadow-gold-glow group text-center font-heading"
                >
                  <Sparkles className="w-5 h-5 text-[#0F172A] group-hover:rotate-12 transition-transform" />
                  <span>Join Now & Register Free</span>
                  <ArrowRight className="w-5 h-5 text-[#0F172A] group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/prizes"
                  className="btn-outline-gold px-9 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2.5 text-center font-heading"
                >
                  <Gift className="w-5 h-5 text-[#D4AF37]" />
                  <span>Explore 70 Grand Prizes</span>
                </Link>
              </div>

              {/* Integrated Countdown Timer */}
              <div className="pt-4 border-t border-[#E8EAF0]">
                <CountdownTimer
                  targetDate={campaign?.drawDate || '2027-05-19T10:00:00.000Z'}
                  label="Official Physical Draw Countdown • 19 May"
                />
              </div>
            </div>

            {/* Right Column: Hero Showcase Carousel */}
            <div className="lg:col-span-5 relative">
              {/* Golden Ambient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/25 via-[#F3E5C1]/35 to-[#D4AF37]/15 rounded-[2.5rem] blur-xl -z-10" />

              <HeroCarousel onSelectPrize={(p) => setSelectedPrize(p)} />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION B: REGISTRATION PROGRESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar
          current={campaign?.currentParticipants || 0}
          target={campaign?.targetParticipants || 10000}
          label="Live Registration Counter"
        />
      </section>

      {/* SECTION C: GRAND PRIZES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-gold text-xs font-black text-[#8C610A] uppercase tracking-widest font-display shadow-xs">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>OFFICIAL REWARD CATALOGUE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-heading text-[#0F172A]">
            GRAND <span className="text-gold-gradient text-gold-glow">PRIZES</span> SHOWCASE
          </h2>
          <p className="text-[#5A657D] text-base leading-relaxed">
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
            className="btn-outline-gold inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-sm font-extrabold shadow-xs"
          >
            <span>View Complete 70-Prize Catalogue</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </div>
      </section>

      {/* SECTION D: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[#E8EAF0] shadow-card-light relative overflow-hidden">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-gold text-xs font-black text-[#8C610A] uppercase tracking-widest font-display shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#18865B]" />
              <span>SIMPLE 6-STEP PARTICIPATION</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black font-heading text-[#0F172A]">
              HOW IT <span className="text-gold-gradient text-gold-glow">WORKS</span>
            </h2>
            <p className="text-[#5A657D] text-base">
              Follow these simple steps to participate in the Grand Lucky Draw.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
                className="p-7 rounded-3xl bg-gradient-to-b from-white to-[#FDFBF7] border border-[#E8EAF0] hover:border-[#D4AF37] hover:shadow-card-hover transition-all duration-300 space-y-4 group relative"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FAF7EE] to-[#F3E5C1] border border-[#D4AF37]/40 shadow-xs flex items-center justify-center text-xl font-black font-display text-[#8C610A] group-hover:scale-105 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-lg font-black text-[#0F172A] font-heading group-hover:text-[#B8860B] transition-colors">{item.title}</h3>
                <p className="text-sm text-[#5A657D] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="btn-gold inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-gold-glow"
            >
              <span>Get Started Now — Register Free</span>
              <ArrowRight className="w-4 h-4 text-[#0F172A]" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION E: DRAW INFORMATION & TRANSPARENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-gold text-xs font-black text-[#8C610A] uppercase tracking-widest font-display shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#18865B]" />
              <span>INTEGRITY & FAIRNESS GUARANTEE</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black font-heading text-[#0F172A] leading-[1.1]">
              100% MANUAL DRAW <br />
              <span className="text-gold-gradient text-gold-glow">ZERO COMPUTER ALGORITHMS</span>
            </h2>
            <p className="text-[#5A657D] leading-relaxed text-base">
              The Grand Lucky Draw follows a strict physical manual draw protocol. The platform never automatically picks random winners. Organizers conduct the manual draw independently in front of cameras and observers.
            </p>
            <div className="space-y-3.5">
              {[
                'Cryptographic participant list freezing with public SHA-256 hash',
                'Physical offline manual draw conducted by independent observers',
                'Two-person administrative approval workflow preventing self-approval',
                'Masked public winner announcement protecting participant privacy'
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-[#0F172A] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#18865B] shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className="pt-3">
              <Link
                to="/draw-information"
                className="btn-outline-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-extrabold shadow-xs"
              >
                <span>Read Full Draw Methodology</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </Link>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white to-[#FDFBF7] border-2 border-[#D4AF37]/30 space-y-6 shadow-card-light relative">
            <h3 className="text-2xl font-black text-[#0F172A] font-heading">
              Key Campaign Dates & Details
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E8EAF0] shadow-xs">
                <span className="text-[#5A657D] font-semibold">Joining Start Date</span>
                <span className="font-bold text-[#8C610A] font-mono">1 December 2026</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E8EAF0] shadow-xs">
                <span className="text-[#5A657D] font-semibold">Registration Closing Date</span>
                <span className="font-bold text-[#0F172A] font-mono">15 May 2027</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7EE] border border-[#D4AF37]/40 shadow-xs">
                <span className="text-[#8C610A] font-bold">Official Draw Date</span>
                <span className="font-black text-[#8C610A] font-mono text-base">19 May 2027</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E8EAF0] shadow-xs">
                <span className="text-[#5A657D] font-semibold">Target Participants</span>
                <span className="font-bold text-[#0F172A] font-mono">10,000 Verified</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E8EAF0] shadow-xs">
                <span className="text-[#5A657D] font-semibold">Campaign Organization</span>
                <span className="font-bold text-[#0F172A]">Grand Lucky Draw Committee</span>
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
              <Megaphone className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-3xl font-black text-[#0F172A] font-heading">
                LATEST <span className="text-gold-gradient text-gold-glow">ANNOUNCEMENTS</span>
              </h2>
            </div>
            <Link to="/about" className="text-xs text-[#8C610A] font-black uppercase tracking-wider hover:underline font-display">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann._id}
                className="p-7 rounded-3xl bg-white border border-[#E8EAF0] hover:border-[#D4AF37]/60 shadow-card-light hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5A657D] mb-3">
                    <span className="px-2.5 py-1 rounded bg-[#FAF7EE] text-[#8C610A] font-black uppercase text-[10px] tracking-wider font-display">{ann.category}</span>
                    <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-black text-[#0F172A] mb-2 font-heading">{ann.title}</h3>
                  <p className="text-xs text-[#5A657D] line-clamp-3 leading-relaxed">{ann.content}</p>
                </div>
                <div className="pt-4 text-xs text-[#8C610A] font-bold border-t border-[#E8EAF0] mt-4 font-mono">
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/30 text-xs font-bold text-[#946708] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#D6A63A]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-[#172033]">
            FREQUENTLY ASKED <span className="text-gold-gradient">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-[#E8EAF0] shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-[#172033] font-bold hover:text-[#B8860B] transition-colors"
              >
                <span className="font-heading text-base sm:text-lg">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#D6A63A] shrink-0 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-[#667085] leading-relaxed border-t border-[#E8EAF0] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Prize Specification Modal */}
      {selectedPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E8EAF0] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-4">
              <div className="text-xl font-black text-[#172033] font-heading">{selectedPrize.name}</div>
              <button
                onClick={() => setSelectedPrize(null)}
                className="text-[#667085] hover:text-[#172033] p-1.5 rounded-lg hover:bg-gray-100 transition-colors font-bold"
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
                <span className="text-xs uppercase font-bold text-[#946708] tracking-wider">Key Specifications:</span>
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

export default HomePage;
