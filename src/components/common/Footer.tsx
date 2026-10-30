import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ShieldCheck, 
  Heart, 
  Radio, 
  Sparkles, 
  Users, 
  Calculator, 
  MapPin, 
  Calendar, 
  Award, 
  Bell, 
  Camera,
  LayoutDashboard,
  Disc,
  Sliders
} from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-vybe-border bg-vybe-dark/95 backdrop-blur-xl pt-16 pb-12 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-vybe-border/60">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vybe-lime to-vybe-violet flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-vybe-dark rounded-[6px] flex items-center justify-center">
                  <span className="font-display font-black text-sm text-vybe-lime">V</span>
                </div>
              </div>
              <span className="font-display font-black text-xl text-slate-100 tracking-wider">VYBE</span>
            </Link>
            
            <p className="text-xs text-vybe-lime font-mono font-bold leading-relaxed">
              "Find Your People. Feel The Music. Make The Moment."
            </p>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              A premium concert and festival discovery platform matching music enthusiasts with unforgettable live music experiences through transparent Vibe DNA algorithms.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Transparent Rule-Based Matching
              </span>
            </div>
          </div>

          {/* Discovery & Experience Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Home & Trending
                </Link>
              </li>
              <li>
                <Link to="/discover" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" /> Smart Event Search & Filters
                </Link>
              </li>
              <li>
                <Link to="/vibe-dna" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-vybe-lime" /> Vibe DNA Personality Quiz
                </Link>
              </li>
              <li>
                <Link to="/artists" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5" /> Artist Explorer & Setlists
                </Link>
              </li>
              <li>
                <Link to="/festival-map" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Crowd Mood & Grounds Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Planning & Community Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Squad & Planning</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/squads" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-vybe-cyan" /> Squad Sync Planner
                </Link>
              </li>
              <li>
                <Link to="/budget" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" /> Total Night-Out Budget
                </Link>
              </li>
              <li>
                <Link to="/schedule" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Festival Schedule Builder
                </Link>
              </li>
              <li>
                <Link to="/ticket-radar" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" /> Ticket Drop Radar
                </Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-vybe-lime" /> Personal Music Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Gamification & Accessibility Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Keepsakes & Control</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/quests" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-vybe-lime" /> Festival Quests & Badges
                </Link>
              </li>
              <li>
                <Link to="/memories" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-pink-400" /> Digital Memory Capsule
                </Link>
              </li>
              <li>
                <Link to="/accessibility-guide" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Access Comfort Guide
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={scrollToTop} className="hover:text-vybe-lime transition-colors flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" /> Preferences & Data Backup
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} VYBE. Built for music lovers, festival tribes, and night owls.
          </div>

          <div className="text-center md:text-right max-w-xl">
            <span className="text-slate-400">Notice:</span> Sample events, ticket prices, ticket availability, crowd density, and live notifications are simulated demonstration data for portfolio evaluation.
          </div>
        </div>

      </div>
    </footer>
  );
};
