import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  ShieldCheck,
  Crown,
  ArrowRight,
  Calendar,
  Users,
  Clock,
  Gift
} from 'lucide-react';
import posterImg from '../assets/grand-lucky-draw-poster.jpg';
import fortunerImg from '../assets/toyota-fortuner.png';
import tharImg from '../assets/mahindra-thar.png';
import swiftImg from '../assets/maruti-swift.png';
import { handleImageError } from '../utils/imageHelper';

const heroSlides = [
  {
    id: 'campaign-overview',
    tabTitle: 'Gala Overview',
    tag: 'OFFICIAL CAMPAIGN 2027',
    tagIcon: Crown,
    statusBadge: '100% Offline Manual Draw',
    statusBadgeIcon: ShieldCheck,
    titleLine1: 'DREAM BIG.',
    titleLine2: 'WIN BIG.',
    subtitle: 'Grand Lucky Draw 2027 • 70 Grand Rewards',
    description:
      'Your opportunity to win 70 life-changing grand rewards including 4 Toyota Fortuners, 5 Mahindra Thars, 20 Swift Cars, 40 Electric Scooters, and a Luxury Farmhouse!',
    bgImage:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=80',
    cardHeaderLeft: 'OFFICIAL CAMPAIGN',
    cardHeaderRight: '100% MANUAL DRAW',
    cardImage: posterImg,
    cardImageFit: 'object-cover',
    cardImageBg: 'bg-[#0F172A]',
    cardCaption: 'Official Physical Gala Draw • 19 May 2027',
    cardSpecs: [
      { label: 'Draw Format:', value: '100% Offline Manual' },
      { label: 'Total Grand Prizes:', value: '70 Listed Rewards', isHighlight: true },
      { label: 'Official Draw Date:', value: '19 May 2027', isGold: true }
    ],
    fleetPills: [
      '4x Fortuner 4x4',
      '5x Thar 4x4',
      '20x Swift Cars',
      '40x EV Scooters',
      '1x Farmhouse'
    ],
    metaHighlights: [
      { label: 'Joining', value: '1 December', icon: Calendar },
      { label: 'Official Draw', value: '19 May', icon: Clock },
      { label: 'Target', value: '10,000 Seats', icon: Users }
    ],
    ctaPrimary: {
      text: 'Join Now & Register Free',
      link: '/register'
    },
    ctaSecondary: {
      text: 'Explore 70 Grand Prizes',
      link: '/prizes'
    }
  },
  {
    id: 'toyota-fortuner',
    tabTitle: 'Toyota Fortuner',
    tag: 'TIER 1 • FLAGSHIP SUV',
    tagIcon: Award,
    statusBadge: '4 Units Available • ₹50+ Lakhs Each',
    statusBadgeIcon: Sparkles,
    titleLine1: 'TOYOTA FORTUNER',
    titleLine2: '4X4 LUXURY',
    subtitle: '4 Brand New Flagship SUVs With Automatic 4WD Diff-Lock',
    description:
      'Command every road with unmatched power and presidential road presence. Fitted with a 2.8L turbo-diesel engine, automatic 4WD with rear diff-lock, premium ventilated leather interior, and 100% legal physical handover.',
    bgImage:
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2000&q=80',
    cardHeaderLeft: 'TIER 1 • FLAGSHIP SUV',
    cardHeaderRight: 'VERIFIED ASSET',
    cardImage: fortunerImg,
    cardImageFit: 'object-contain',
    cardImageBg: 'bg-gradient-to-b from-white to-[#F5F2EB]',
    cardCaption: 'Toyota Fortuner 4x4 Luxury • 2.8L Diesel',
    cardSpecs: [
      { label: 'Draw Format:', value: '100% Offline Manual' },
      { label: 'Units Allocated:', value: '4 Brand New Units', isHighlight: true },
      { label: 'Market Value:', value: '₹50+ Lakhs Each', isGold: true }
    ],
    fleetPills: [
      '2.8L Diesel Turbo',
      'Auto Diff-Lock 4x4',
      'Ventilated Leather Seats',
      '4 Units Allocated'
    ],
    metaHighlights: [
      { label: 'Allocation', value: '4 Brand New Units', icon: Award },
      { label: 'Estimated Value', value: '₹50+ Lakhs Each', icon: Crown },
      { label: 'Handover', value: '100% Physical', icon: ShieldCheck }
    ],
    ctaPrimary: {
      text: 'Join to Win Fortuner',
      link: '/register'
    },
    ctaSecondary: {
      text: 'View Fortuner Specs',
      link: '/prizes'
    }
  },
  {
    id: 'mahindra-thar',
    tabTitle: 'Mahindra Thar 4x4',
    tag: 'TIER 2 • OFF-ROAD LEGEND',
    tagIcon: Sparkles,
    statusBadge: '5 Units Available • Hard Top',
    statusBadgeIcon: Crown,
    titleLine1: 'MAHINDRA THAR',
    titleLine2: '4X4 HARD TOP',
    subtitle: '5 Iconic All-Terrain Adventure Off-Roaders',
    description:
      'Engineered to conquer untamed Indian trails with absolute confidence. Equipped with high ground clearance, heavy-duty all-terrain tires, shift-on-the-fly 4WD low range, and iconic road presence.',
    bgImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80',
    cardHeaderLeft: 'TIER 2 • OFF-ROAD LEGEND',
    cardHeaderRight: 'HARD TOP 4X4',
    cardImage: tharImg,
    cardImageFit: 'object-contain',
    cardImageBg: 'bg-gradient-to-b from-white to-[#F5F2EB]',
    cardCaption: 'Mahindra Thar 4x4 • Hard Top Edition',
    cardSpecs: [
      { label: 'Draw Format:', value: '100% Offline Manual' },
      { label: 'Units Allocated:', value: '5 Brand New Units', isHighlight: true },
      { label: 'Drive System:', value: 'Shift-on-Fly 4WD Low', isGold: true }
    ],
    fleetPills: [
      'M-Stallion Turbo',
      '4WD Low Range',
      'High Ground Clearance',
      '5 Units Allocated'
    ],
    metaHighlights: [
      { label: 'Allocation', value: '5 Brand New Units', icon: Award },
      { label: 'Edition', value: 'Hard Top 4x4', icon: Sparkles },
      { label: 'Draw System', value: 'Physical Token', icon: ShieldCheck }
    ],
    ctaPrimary: {
      text: 'Claim Free Ticket',
      link: '/register'
    },
    ctaSecondary: {
      text: 'View Thar Specs',
      link: '/prizes'
    }
  },
  {
    id: 'maruti-swift',
    tabTitle: 'Maruti Suzuki Swift',
    tag: 'HIGH ODDS • 20 UNITS',
    tagIcon: Award,
    statusBadge: '20 Brand New Swift Cars + 40 EV Scooters',
    statusBadgeIcon: Sparkles,
    titleLine1: 'MARUTI SUZUKI SWIFT',
    titleLine2: '& 40X EV SCOOTERS',
    subtitle: '20 Brand New Swift Hatchbacks & 40 Smart Electric Scooters',
    description:
      'Maximum winning probability for registered participants! Drive home a brand-new Maruti Suzuki Swift hatchback or a fast-charging smart electric scooter with 120km range per charge.',
    bgImage:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80',
    cardHeaderLeft: 'COMMUTER FLEET',
    cardHeaderRight: '20 UNITS ALLOCATED',
    cardImage: swiftImg,
    cardImageFit: 'object-contain',
    cardImageBg: 'bg-gradient-to-b from-white to-[#F5F2EB]',
    cardCaption: 'Maruti Suzuki Swift • 20 Units & 40 EV Scooters',
    cardSpecs: [
      { label: 'Draw Format:', value: '100% Offline Manual' },
      { label: 'Cars Allocated:', value: '20 Brand New Swift Cars', isHighlight: true },
      { label: 'Bonus Fleet:', value: 'Plus 40 Smart EV Scooters', isGold: true }
    ],
    fleetPills: [
      '20x Swift Hatchbacks',
      '40x Smart EV Scooters',
      '120km Range Per Charge',
      'Fast Charging'
    ],
    metaHighlights: [
      { label: 'Swift Hatchbacks', value: '20 Brand New Units', icon: Crown },
      { label: 'EV Scooters', value: '40 Units Available', icon: Award },
      { label: 'Cost to Enter', value: '100% Free Entry', icon: ShieldCheck }
    ],
    ctaPrimary: {
      text: 'Register Free Ticket',
      link: '/register'
    },
    ctaSecondary: {
      text: 'Explore All 70 Prizes',
      link: '/prizes'
    }
  },
  {
    id: 'luxury-farmhouse',
    tabTitle: 'Luxury Farmhouse',
    tag: 'GRAND ASSET • FREEHOLD ESTATE',
    tagIcon: Crown,
    statusBadge: '1 Grand Freehold Estate',
    statusBadgeIcon: Award,
    titleLine1: 'LUXURY FARMHOUSE',
    titleLine2: 'ESTATE WITH POOL',
    subtitle: 'Prime Gated Countryside Estate with Private Swimming Pool',
    description:
      'A personal sanctuary of tranquility and luxury. Features a private swimming pool, landscaped manicured lawn, and 24/7 security with 100% legal freehold title deed registration transferred to the winner.',
    bgImage:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=85',
    cardHeaderLeft: 'GRAND FREEHOLD ESTATE',
    cardHeaderRight: 'VERIFIED TITLE',
    cardImage:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=85',
    cardImageFit: 'object-cover',
    cardImageBg: 'bg-[#0F172A]',
    cardCaption: 'Private Pool & Countryside Grounds',
    cardSpecs: [
      { label: 'Draw Format:', value: '100% Offline Manual' },
      { label: 'Title Handover:', value: 'Permanent Legal Deed', isHighlight: true },
      { label: 'Official Draw Date:', value: '19 May 2027', isGold: true }
    ],
    fleetPills: [
      'Private Swimming Pool',
      'Gated Community',
      'Freehold Legal Title',
      '1 Lucky Winner'
    ],
    metaHighlights: [
      { label: 'Ownership', value: 'Permanent Freehold', icon: Crown },
      { label: 'Amenities', value: 'Private Pool & Lawn', icon: Sparkles },
      { label: 'Legality', value: 'Documented Deed', icon: ShieldCheck }
    ],
    ctaPrimary: {
      text: 'Enter Free Lucky Draw',
      link: '/register'
    },
    ctaSecondary: {
      text: 'Inspect Estate Specs',
      link: '/prizes'
    }
  }
];

const HeroCarousel = ({ campaign, onSelectPrize }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = heroSlides.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimerKey((k) => k + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimerKey((k) => k + 1);
  };

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
    setTimerKey((k) => k + 1);
  };

  // Continuous auto-scroll every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
      setTimerKey((k) => k + 1);
    }, 4500);

    return () => clearInterval(timer);
  }, [timerKey, total]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative w-full min-h-[88vh] lg:min-h-[92vh] max-h-[960px] bg-[#0A0F1D] text-white overflow-hidden flex items-center select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Grand Lucky Draw Hero Showcase Carousel"
    >
      {/* BACKGROUND SLIDES WITH CROSS-FADE & KEN BURNS ZOOM */}
      {heroSlides.map((slide, idx) => {
        const isActive = currentIndex === idx;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={slide.bgImage}
              alt={slide.tabTitle}
              className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              onError={handleImageError}
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/95 via-[#070B14]/85 to-[#070B14]/45 lg:to-[#070B14]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-black/35" />

            {/* Golden Spotlight Aura */}
            <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-[#D4AF37]/20 via-[#F3E5C1]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
          </div>
        );
      })}

      {/* FOREGROUND SLIDE CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {heroSlides.map((slide, idx) => {
          const isActive = currentIndex === idx;
          if (!isActive) return null;

          const TagIcon = slide.tagIcon;
          const StatusIcon = slide.statusBadgeIcon;

          return (
            <div
              key={slide.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center animate-fadeIn"
            >
              {/* Left Column: Headlines, CTAs, Fleet & Meta (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
                {/* Category & Status Pill Bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/60 text-xs sm:text-sm font-black uppercase tracking-widest text-[#F0C75E] font-display shadow-xs">
                    <TagIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>{slide.tag}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#F0C75E]" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18865B]/20 backdrop-blur-md border border-[#18865B]/40 text-[#4ADE80] text-xs sm:text-sm font-bold uppercase tracking-wider">
                    <StatusIcon className="w-4 h-4 text-[#4ADE80]" />
                    <span>{slide.statusBadge}</span>
                  </div>
                </div>

                {/* Main Slide Title */}
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm uppercase tracking-[0.3em] font-display font-black text-[#D4AF37] flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent" />
                    <span>EXCLUSIVE LOTTERY GALA</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-heading tracking-tight text-white leading-[1.06]">
                    {slide.titleLine1} <br />
                    <span className="text-gold-gradient text-gold-glow">
                      {slide.titleLine2}
                    </span>
                  </h1>
                  <p className="text-lg sm:text-2xl font-black text-[#F3E5C1] font-heading flex flex-wrap items-center gap-2 pt-1">
                    <span>{slide.subtitle}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-[#CBD2E0] leading-relaxed max-w-2xl font-normal">
                  {slide.description}
                </p>

                {/* Specification / Fleet Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {slide.fleetPills.map((pill, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-white shadow-xs hover:border-[#D4AF37] transition-colors"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {/* Meta Highlights Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl pt-1">
                  {slide.metaHighlights.map((meta, mIdx) => {
                    const MetaIcon = meta.icon;
                    return (
                      <div
                        key={mIdx}
                        className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-center gap-2.5 sm:gap-3"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#F3E5C1]/10 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                          <MetaIcon className="w-4 h-4 text-[#F0C75E]" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block font-display truncate">
                            {meta.label}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-white font-heading truncate block">
                            {meta.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    to={slide.ctaPrimary.link}
                    className="btn-gold px-8 sm:px-10 py-4 rounded-2xl text-base font-black tracking-wide flex items-center justify-center gap-2.5 shadow-gold-glow text-[#0F172A] group font-heading"
                  >
                    <Sparkles className="w-5 h-5 text-[#0F172A] group-hover:rotate-12 transition-transform" />
                    <span>{slide.ctaPrimary.text}</span>
                    <ArrowRight className="w-5 h-5 text-[#0F172A] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to={slide.ctaSecondary.link}
                    className="px-8 sm:px-10 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2.5 text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all font-heading"
                  >
                    <Gift className="w-5 h-5 text-[#D4AF37]" />
                    <span>{slide.ctaSecondary.text}</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Unified Frosted Glass Showcase Card (5 Cols - Matching Farmhouse Showcase) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#F0C75E] font-display">
                    <span>{slide.cardHeaderLeft}</span>
                    <span>{slide.cardHeaderRight}</span>
                  </div>

                  {/* Inner Image Frame */}
                  <div
                    className={`relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/20 ${
                      slide.cardImageBg || 'bg-[#0F172A]'
                    } flex items-center justify-center`}
                  >
                    <img
                      src={slide.cardImage}
                      alt={slide.tabTitle}
                      className={`w-full h-full ${slide.cardImageFit} p-2 hover:scale-105 transition-transform duration-500`}
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs font-bold text-white drop-shadow-md">
                      {slide.cardCaption}
                    </div>
                  </div>

                  {/* Key Specifications Table */}
                  <div className="space-y-2 text-xs text-[#CBD2E0] pt-1">
                    {slide.cardSpecs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className={`flex items-center justify-between py-1.5 ${
                          sIdx !== slide.cardSpecs.length - 1
                            ? 'border-b border-white/10'
                            : ''
                        }`}
                      >
                        <span className="text-[#94A3B8] font-medium">
                          {spec.label}
                        </span>
                        <span
                          className={`font-bold ${
                            spec.isHighlight
                              ? 'text-[#4ADE80]'
                              : spec.isGold
                              ? 'text-[#F0C75E]'
                              : 'text-white'
                          }`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDGE-ANCHORED NAVIGATION ARROWS */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/45 hover:bg-[#D4AF37] hover:text-[#0F172A] text-white border border-[#D4AF37]/50 backdrop-blur-md shadow-xl flex items-center justify-center transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/45 hover:bg-[#D4AF37] hover:text-[#0F172A] text-white border border-[#D4AF37]/50 backdrop-blur-md shadow-xl flex items-center justify-center transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* BOTTOM SLIDE CONTROL BAR (TABS + COUNTER + AUTO-ROTATION STATUS) */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-2xl border border-white/15">
          {/* Slide Tab Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1">
            {heroSlides.map((slide, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`relative overflow-hidden px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#F0C75E] to-[#B88214] text-[#0F172A] shadow-md font-heading scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{slide.tabTitle}</span>

                  {/* Active Auto-Scroll Progress Line */}
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0F172A]/25 overflow-hidden">
                      <div
                        key={timerKey}
                        className="h-full bg-[#0F172A] animate-carousel-progress"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Status: Counter & Auto-Scroll Status */}
          <div className="flex items-center gap-3 text-xs font-bold text-white/80 shrink-0">
            <span className="font-mono px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[#F0C75E]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#CBD2E0] hidden md:inline-flex uppercase tracking-wider font-display">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <span>Auto-Scrolling (4.5s)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
