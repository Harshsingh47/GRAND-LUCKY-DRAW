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
  ExternalLink
} from 'lucide-react';
import posterImg from '../assets/grand-lucky-draw-poster.jpg';
import { handleImageError } from '../utils/imageHelper';

const heroSlides = [
  {
    id: 'campaign-overview',
    tag: 'Official Campaign 2027',
    tagIcon: Crown,
    title: '70 Listed Grand Rewards',
    subtitle: 'Toyota Fortuners, Mahindra Thars, Swift Cars & Farmhouse',
    image: posterImg,
    badgePrimary: 'Zero Computer Algorithms',
    badgeSecondary: '100% Offline Manual Draw',
    fleet: [
      '4x Fortuner 4x4',
      '5x Thar 4x4',
      '20x Swift Cars',
      '40x EV Scooters',
      '1x Farmhouse'
    ],
    ctaText: 'Explore Complete Fleet',
    ctaLink: '/prizes'
  },
  {
    id: 'toyota-fortuner',
    tag: 'Tier 1 • Flagship SUV',
    tagIcon: Award,
    title: 'Toyota Fortuner 4x4 Luxury',
    subtitle: '4 Brand New Flagship SUVs with automatic 4WD diff-lock',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    badgePrimary: '4 Units Available',
    badgeSecondary: 'Worth ₹50+ Lakhs Each',
    fleet: [
      '2.8L Diesel',
      'Auto Diff-Lock',
      'Ventilated Seats',
      'White Pearl'
    ],
    ctaText: 'View Fortuner Specs',
    ctaLink: '/prizes'
  },
  {
    id: 'mahindra-thar',
    tag: 'Tier 2 • Off-Road Legend',
    tagIcon: Sparkles,
    title: 'Mahindra Thar 4x4 Hard Top',
    subtitle: '5 Iconic all-terrain adventure off-roaders with 4WD low range',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    badgePrimary: '5 Units Available',
    badgeSecondary: 'Hard Top 4x4',
    fleet: [
      'M-Stallion Turbo',
      'All-Terrain Tyres',
      'High Clearance',
      'Convertible/Hard'
    ],
    ctaText: 'View Thar Specs',
    ctaLink: '/prizes'
  },
  {
    id: 'luxury-farmhouse',
    tag: 'Grand Asset • Freehold Real Estate',
    tagIcon: Crown,
    title: 'Luxury Farmhouse Estate',
    subtitle: 'Prime gated countryside estate with private swimming pool & garden',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    badgePrimary: '1 Grand Estate',
    badgeSecondary: 'Permanent Legal Deed',
    fleet: [
      'Private Pool',
      'Landscaped Lawn',
      'Freehold Title',
      'Gated Community'
    ],
    ctaText: 'View Estate Specs',
    ctaLink: '/prizes'
  },
  {
    id: 'ev-scooters',
    tag: 'Eco Mobility • City Fleet',
    tagIcon: Award,
    title: '40x Smart Electric Scooters',
    subtitle: 'Next-gen electric two-wheelers with smart digital dashboard & fast charge',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    badgePrimary: '40 Units Available',
    badgeSecondary: '120km Range Per Charge',
    fleet: [
      'Fast Charging',
      'Smart Digital App',
      'Reverse Mode',
      'Eco & Sport'
    ],
    ctaText: 'View 40 EV Scooters',
    ctaLink: '/prizes'
  }
];

const HeroCarousel = ({ onSelectPrize }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const total = heroSlides.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused]);

  const current = heroSlides[currentIndex];
  const TagIcon = current.tagIcon;

  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-white border-2 border-[#D4AF37]/40 shadow-card-hover group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Banner Navigation bar inside frame */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Floating Top Category Pill */}
        <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-sm flex items-center gap-2 text-xs font-black text-[#0F172A] font-display pointer-events-auto">
          <TagIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{current.tag}</span>
        </div>

        {/* Counter Badge */}
        <div className="px-3 py-1 rounded-full bg-[#0F172A]/85 backdrop-blur-md border border-[#D4AF37]/40 text-white font-mono text-xs font-bold pointer-events-auto">
          {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>

      {/* Slide Image Frame */}
      <div className="relative h-72 sm:h-84 md:h-96 overflow-hidden bg-[#FAF8F5]">
        <img
          key={current.id}
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover object-center transition-all duration-700 transform group-hover:scale-[1.03]"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/20 to-black/20 pointer-events-none" />

        {/* Floating Bottom Left Badge */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#D4AF37]/40 shadow-sm flex items-center gap-1.5 text-xs font-extrabold text-[#8C610A]">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{current.badgePrimary}</span>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-[#0F172A]/85 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            <span>{current.badgeSecondary}</span>
          </div>
        </div>

        {/* Left / Right Nav Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/40 text-[#0F172A] hover:bg-white hover:text-[#B8860B] shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/40 text-[#0F172A] hover:bg-white hover:text-[#B8860B] shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Details Bottom Bar */}
      <div className="p-5 bg-gradient-to-b from-white to-[#FDFBF7] border-t border-[#E8EAF0] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#0F172A] font-heading leading-tight">
              {current.title}
            </h3>
            <p className="text-xs text-[#5A657D] line-clamp-1 mt-0.5">
              {current.subtitle}
            </p>
          </div>
          <Link
            to={current.ctaLink}
            className="px-3.5 py-1.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs font-heading"
          >
            <span>{current.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0F172A]" />
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-xs font-bold text-[#0F172A]">
          {current.fleet.map((item, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#D4AF37]/30 text-[11px] shadow-xs text-[#0F172A]"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8EAF0]/80">
          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-7 bg-gradient-to-r from-[#F0C75E] to-[#B88214] shadow-xs'
                    : 'w-2 bg-[#CBD2E0] hover:bg-[#D4AF37]/60'
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] text-[#5A657D] uppercase font-bold tracking-wider font-display">
            {isPaused ? 'Paused on Hover' : 'Auto-Rotating'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
