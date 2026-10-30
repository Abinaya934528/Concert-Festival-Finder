import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Users, 
  Calculator, 
  MapPin, 
  Calendar, 
  Award, 
  Bell, 
  Heart, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Radio, 
  Sliders, 
  ShieldCheck, 
  Disc,
  Camera,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES_LIST } from '../../data/mockEvents';

export const Navbar: React.FC = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    currency, 
    setCurrency, 
    theme, 
    toggleTheme,
    savedEventIds,
    vibeProfile
  } = useApp();

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks: { path: string; label: string; icon: React.ReactNode; badge?: number }[] = [
    { path: '/discover', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { path: '/vibe-dna', label: 'Vibe DNA', icon: <Sparkles className="w-4 h-4 text-vybe-lime" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-vybe-cyan" />, badge: savedEventIds.length },
    { path: '/squads', label: 'Squad Sync', icon: <Users className="w-4 h-4" /> },
    { path: '/budget', label: 'Budget', icon: <Calculator className="w-4 h-4" /> },
    { path: '/schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { path: '/festival-map', label: 'Mood Map', icon: <MapPin className="w-4 h-4" /> },
    { path: '/artists', label: 'Artists', icon: <Disc className="w-4 h-4" /> },
    { path: '/quests', label: 'Quests', icon: <Award className="w-4 h-4" /> },
    { path: '/ticket-radar', label: 'Drop Radar', icon: <Bell className="w-4 h-4" /> },
    { path: '/memories', label: 'Memories', icon: <Camera className="w-4 h-4 text-pink-400" /> },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-vybe-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-4">
          <Link 
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vybe-lime via-vybe-cyan to-vybe-violet flex items-center justify-center p-0.5 shadow-glow-lime group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-vybe-dark rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-xl tracking-tighter text-vybe-lime group-hover:text-white transition-colors">V</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-wider text-slate-100 group-hover:text-vybe-lime transition-colors">
                  VYBE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-vybe-surface text-vybe-lime border border-vybe-lime/30 font-semibold tracking-wider">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Feel The Music. Make The Moment.
              </p>
            </div>
          </Link>

          {/* City Selector */}
          <div className="relative ml-2 hidden md:block">
            <button
              onClick={() => {
                setCityDropdownOpen(!cityDropdownOpen);
                setCurrencyDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vybe-card border border-vybe-border text-xs font-medium hover:border-vybe-lime/40 text-slate-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-vybe-lime" />
              <span>{selectedCity}</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-xl bg-vybe-card border border-vybe-border shadow-glass py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-mono uppercase text-slate-400">Select City</div>
                {CITIES_LIST.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-vybe-surface transition-colors ${
                      selectedCity === city ? 'text-vybe-lime font-bold bg-vybe-lime/10' : 'text-slate-300'
                    }`}
                  >
                    {city}
                    {selectedCity === city && <span className="text-vybe-lime">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 6).map(link => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive 
                    ? 'bg-vybe-lime text-black font-extrabold shadow-glow-lime' 
                    : 'text-slate-300 hover:text-white hover:bg-vybe-surface'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-black text-vybe-lime' : 'bg-vybe-lime text-black'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* More menu dropdown for remaining links */}
          <div className="relative group">
            <button className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-vybe-surface flex items-center gap-1">
              <span>More</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>
            <div className="absolute right-0 mt-1 w-52 rounded-xl bg-vybe-card border border-vybe-border shadow-glass py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
              {navLinks.slice(6).map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-vybe-surface transition-colors ${
                      isActive ? 'text-vybe-lime font-bold bg-vybe-lime/10' : 'text-slate-300'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
              <div className="border-t border-vybe-border my-1.5"></div>
              <NavLink
                to="/accessibility-guide"
                className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-slate-300 hover:bg-vybe-surface"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Access Comfort Guide</span>
              </NavLink>
              <NavLink
                to="/profile"
                className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-slate-300 hover:bg-vybe-surface"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Preferences & Backup</span>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Right Controls: Currency, Theme & Vibe DNA CTA */}
        <div className="flex items-center gap-2">
          
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setCityDropdownOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-vybe-card border border-vybe-border text-xs font-mono font-medium hover:border-vybe-lime/40 text-slate-300 transition-colors"
            >
              {currency}
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 rounded-xl bg-vybe-card border border-vybe-border shadow-glass py-1 z-50">
                {['INR', 'USD', 'EUR', 'GBP'].map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1 text-xs font-mono hover:bg-vybe-surface ${
                      currency === c ? 'text-vybe-lime font-bold' : 'text-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2 rounded-lg bg-vybe-card border border-vybe-border text-slate-300 hover:text-vybe-lime transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Vibe DNA Profile Badge CTA */}
          <Link
            to="/vibe-dna"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-vybe-violet/30 to-vybe-lime/20 border border-vybe-lime/40 hover:border-vybe-lime text-xs font-bold text-slate-100 hover:shadow-glow-lime transition-all duration-200"
          >
            <span className="text-sm">{vibeProfile?.discoveryPersonality.badgeEmoji || '✨'}</span>
            <span className="hidden md:inline font-sans font-medium text-vybe-lime">
              {vibeProfile?.discoveryPersonality.title || 'My Vibe DNA'}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-vybe-card border border-vybe-border text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-vybe-border bg-vybe-dark/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
          
          {/* City selector in mobile */}
          <div className="pb-3 border-b border-vybe-border">
            <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">Select City</label>
            <div className="grid grid-cols-2 gap-1.5">
              {CITIES_LIST.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left border ${
                    selectedCity === city 
                      ? 'bg-vybe-lime/10 border-vybe-lime text-vybe-lime' 
                      : 'border-vybe-border text-slate-300 bg-vybe-card'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
                    isActive 
                      ? 'bg-vybe-lime text-black font-bold border-vybe-lime' 
                      : 'bg-vybe-card border-vybe-border text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-vybe-violet text-white">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-2 border-t border-vybe-border flex items-center justify-between">
            <NavLink
              to="/accessibility-guide"
              onClick={closeMobileMenu}
              className="text-xs text-slate-400 hover:text-vybe-lime flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Access Guide</span>
            </NavLink>
            <NavLink
              to="/profile"
              onClick={closeMobileMenu}
              className="text-xs text-slate-400 hover:text-vybe-lime flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Preferences</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
