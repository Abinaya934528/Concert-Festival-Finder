import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PageLoader } from './components/common/PageLoader';
import { EventDetailModal } from './components/events/EventDetailModal';
import { ArtistDetailModal } from './components/artists/ArtistDetailModal';

// Code-split Lazy-Loaded Features
const HomeDashboard = lazy(() => import('./features/home/HomeDashboard').then(m => ({ default: m.HomeDashboard })));
const ExploreEvents = lazy(() => import('./features/discovery/ExploreEvents').then(m => ({ default: m.ExploreEvents })));
const EventDetailPage = lazy(() => import('./features/event-detail/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const ArtistExplorerPage = lazy(() => import('./features/artist-explorer/ArtistExplorerPage').then(m => ({ default: m.ArtistExplorerPage })));
const ArtistDetailPage = lazy(() => import('./features/artist-detail/ArtistDetailPage').then(m => ({ default: m.ArtistDetailPage })));
const VibeProfilePage = lazy(() => import('./features/vibe-profile/VibeProfilePage').then(m => ({ default: m.VibeProfilePage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SquadSyncPage = lazy(() => import('./features/squad-sync/SquadSyncPage').then(m => ({ default: m.SquadSyncPage })));
const BudgetPlannerPage = lazy(() => import('./features/budget-planner/BudgetPlannerPage').then(m => ({ default: m.BudgetPlannerPage })));
const FestivalSchedulePage = lazy(() => import('./features/festival-schedule/FestivalSchedulePage').then(m => ({ default: m.FestivalSchedulePage })));
const CrowdMoodMapPage = lazy(() => import('./features/crowd-mood-map/CrowdMoodMapPage').then(m => ({ default: m.CrowdMoodMapPage })));
const TicketDropRadarPage = lazy(() => import('./features/ticket-drop-radar/TicketDropRadarPage').then(m => ({ default: m.TicketDropRadarPage })));
const FestivalQuestPage = lazy(() => import('./features/festival-quest/FestivalQuestPage').then(m => ({ default: m.FestivalQuestPage })));
const MemoryCapsulePage = lazy(() => import('./features/memory-capsule/MemoryCapsulePage').then(m => ({ default: m.MemoryCapsulePage })));
const AccessComfortGuidePage = lazy(() => import('./features/access-guide/AccessComfortGuidePage').then(m => ({ default: m.AccessComfortGuidePage })));
const UserPreferencesPage = lazy(() => import('./features/preferences/UserPreferencesPage').then(m => ({ default: m.UserPreferencesPage })));
const EventReviewsPage = lazy(() => import('./features/reviews/EventReviewsPage').then(m => ({ default: m.EventReviewsPage })));
const EventBuddyPage = lazy(() => import('./features/social-buddy/EventBuddyPage').then(m => ({ default: m.EventBuddyPage })));

// Scroll to top automatically on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const { 
    activeEventModal, 
    setActiveEventModal, 
    activeArtistModal, 
    setActiveArtistModal,
    toastMessage
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-vybe-dark text-slate-100 font-sans selection:bg-vybe-lime selection:text-black">
      <ScrollToTop />

      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main Routed Page Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* 1. Home / Landing */}
            <Route path="/" element={<HomeDashboard />} />

            {/* 2. Smart Event Discovery */}
            <Route path="/discover" element={<ExploreEvents />} />

            {/* 3. Event Details */}
            <Route path="/event/:id" element={<EventDetailPage />} />

            {/* 4. Artist Explorer & Details */}
            <Route path="/artists" element={<ArtistExplorerPage />} />
            <Route path="/artist/:id" element={<ArtistDetailPage />} />

            {/* 5. Vibe DNA Quiz */}
            <Route path="/vibe-dna" element={<VibeProfilePage />} />

            {/* 6. Personal Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 7. Squad Sync */}
            <Route path="/squads" element={<SquadSyncPage />} />

            {/* 8. Night-Out Budget Planner */}
            <Route path="/budget" element={<BudgetPlannerPage />} />

            {/* 9. Festival Schedule Builder */}
            <Route path="/schedule" element={<FestivalSchedulePage />} />

            {/* 10. Crowd Mood & Grounds Map */}
            <Route path="/festival-map" element={<CrowdMoodMapPage />} />

            {/* 11. Ticket Drop Radar */}
            <Route path="/ticket-radar" element={<TicketDropRadarPage />} />

            {/* 12. Festival Quest */}
            <Route path="/quests" element={<FestivalQuestPage />} />

            {/* 13. Memory Capsule Scrapbook */}
            <Route path="/memories" element={<MemoryCapsulePage />} />

            {/* 14. Access Comfort Guide */}
            <Route path="/accessibility-guide" element={<AccessComfortGuidePage />} />

            {/* 15. User Preferences & Data Backup */}
            <Route path="/profile" element={<UserPreferencesPage />} />

            {/* Supplementary Community & Review Pages */}
            <Route path="/reviews" element={<EventReviewsPage />} />
            <Route path="/event-buddy" element={<EventBuddyPage />} />

            {/* Aliases & Redirects for backward compatibility */}
            <Route path="/explore" element={<Navigate to="/discover" replace />} />
            <Route path="/events" element={<Navigate to="/discover" replace />} />
            <Route path="/saved" element={<Navigate to="/dashboard" replace />} />
            <Route path="/saved-events" element={<Navigate to="/dashboard" replace />} />
            <Route path="/squad-sync" element={<Navigate to="/squads" replace />} />
            <Route path="/budget-planner" element={<Navigate to="/budget" replace />} />
            <Route path="/festival-schedule" element={<Navigate to="/schedule" replace />} />
            <Route path="/crowd-mood-map" element={<Navigate to="/festival-map" replace />} />
            <Route path="/artist-explorer" element={<Navigate to="/artists" replace />} />
            <Route path="/festival-quest" element={<Navigate to="/quests" replace />} />
            <Route path="/memory-capsule" element={<Navigate to="/memories" replace />} />
            <Route path="/user-preferences" element={<Navigate to="/profile" replace />} />
            <Route path="/accessibility" element={<Navigate to="/accessibility-guide" replace />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Modals (for quick preview from any component) */}
      {activeEventModal && (
        <EventDetailModal 
          event={activeEventModal} 
          onClose={() => setActiveEventModal(null)} 
        />
      )}

      {activeArtistModal && (
        <ArtistDetailModal 
          artist={activeArtistModal} 
          onClose={() => setActiveArtistModal(null)} 
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl glass-panel border border-vybe-lime/40 shadow-glow-lime text-xs font-semibold text-slate-100 flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-vybe-lime animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
