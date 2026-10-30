import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TicketAlert } from '../../types';
import { 
  Bell, 
  Clock, 
  Calendar, 
  ExternalLink, 
  Trash2, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  CheckCircle2
} from 'lucide-react';

export const TicketDropRadarPage: React.FC = () => {
  const { 
    ticketAlerts, 
    saveTicketAlert, 
    removeTicketAlert, 
    allEvents, 
    setActiveEventModal, 
    showToast 
  } = useApp();

  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const requestBrowserPermission = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          showToast('Browser notifications enabled for ticket drops!');
        } else {
          showToast('Browser notifications were not granted.');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      showToast('Browser notification API is not supported on this device.');
    }
  };

  // Events that have upcoming ticket drops
  const eventsWithDrops = allEvents.filter(e => e.ticketDropDate);

  // Countdown timer helper
  const calculateTimeLeft = (dropDateString: string) => {
    const diff = new Date(dropDateString).getTime() - new Date().getTime();
    if (diff <= 0) return 'DROP LIVE NOW';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    return `${days}d ${hours}h ${minutes}m left`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-violet/20 border border-vybe-violet/40 text-xs font-mono text-vybe-violet-glow mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>On-Sale Early Warning Radar</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Ticket Drop Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Never miss early-bird passes or secret phase drops. Configure local countdown triggers and official sale alerts.
          </p>
        </div>

        {/* Browser Notification Status Button */}
        {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
          <button
            onClick={requestBrowserPermission}
            className="px-4 py-2.5 rounded-xl bg-vybe-violet text-white text-xs font-bold hover:bg-vybe-violet-glow hover:text-black transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Bell className="w-4 h-4" />
            <span>Enable Browser Alerts</span>
          </button>
        )}
      </div>

      {/* Notification API Status Alert */}
      <div className="p-4 rounded-2xl glass-panel border border-vybe-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Alert Dispatch Status: <strong className="text-slate-100 font-mono capitalize">{notificationPermission}</strong> (Local In-App Triggers Active)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {ticketAlerts.length} Active Radar Watchers
        </span>
      </div>

      {/* Tracked Ticket Drops List */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
          Active Tracked Events ({ticketAlerts.length})
        </h3>

        {ticketAlerts.length > 0 ? (
          <div className="space-y-3">
            {ticketAlerts.map(alert => {
              const matchedEvent = allEvents.find(e => e.id === alert.eventId);
              const timeLeft = calculateTimeLeft(alert.dropDate);

              return (
                <div 
                  key={alert.id}
                  className="p-5 rounded-2xl glass-card border border-vybe-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-vybe-lime text-black font-bold">
                        {timeLeft}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Target Tier: {alert.tierName}
                      </span>
                    </div>

                    <h4 
                      onClick={() => matchedEvent && setActiveEventModal(matchedEvent)}
                      className="font-display font-bold text-lg text-slate-100 hover:text-vybe-lime cursor-pointer transition-colors"
                    >
                      {alert.eventName}
                    </h4>

                    <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-vybe-violet-glow" />
                      <span>Drop Date: {new Date(alert.dropDate).toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {matchedEvent?.officialUrl && (
                      <a
                        href={matchedEvent.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-vybe-lime flex items-center gap-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => removeTicketAlert(alert.eventId)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-vybe-surface transition-colors"
                      title="Cancel alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-vybe-card border border-vybe-border text-center text-slate-400 space-y-2">
            <p>No active ticket drop alerts configured yet.</p>
            <p className="text-xs">Browse upcoming confirmed on-sale releases below and add them to your radar.</p>
          </div>
        )}
      </div>

      {/* Upcoming Confirmed On-Sale Releases */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Upcoming Announced Ticket Drops
          </h3>
          <p className="text-xs text-slate-400">Verified official ticket releases on organizer portals</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {eventsWithDrops.map(ev => {
            const isTracking = ticketAlerts.some(a => a.eventId === ev.id);
            const dropDateFormatted = ev.ticketDropDate ? new Date(ev.ticketDropDate).toLocaleDateString() : 'TBA';

            return (
              <div 
                key={ev.id}
                className="p-4 rounded-2xl bg-vybe-surface border border-vybe-border flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-card text-vybe-cyan border border-vybe-border">
                      {ev.city}
                    </span>
                    <span className="text-xs font-mono text-vybe-lime font-bold">
                      Drop: {dropDateFormatted}
                    </span>
                  </div>

                  <h4 
                    onClick={() => setActiveEventModal(ev)}
                    className="font-display font-bold text-sm text-slate-100 hover:text-vybe-lime cursor-pointer transition-colors mt-2"
                  >
                    {ev.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {ev.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-vybe-border flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">
                    From ₹{ev.ticketPriceMin.toLocaleString()}
                  </span>

                  <button
                    onClick={() => {
                      if (isTracking) {
                        removeTicketAlert(ev.id);
                      } else {
                        saveTicketAlert({
                          id: `alt-${Date.now()}`,
                          eventId: ev.id,
                          eventName: ev.title,
                          eventDate: ev.startDate,
                          dropDate: ev.ticketDropDate || ev.startDate,
                          tierName: ev.ticketTiers[0]?.name || 'General Admission',
                          notifyAtSale: true,
                          notify1DayBefore: true,
                          notify1HourBefore: true,
                          createdAt: new Date().toISOString()
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isTracking 
                        ? 'bg-vybe-lime/10 text-vybe-lime border border-vybe-lime/40' 
                        : 'bg-vybe-lime text-black hover:bg-vybe-lime-hover shadow-glow-lime'
                    }`}
                  >
                    {isTracking ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isTracking ? 'Tracking Active' : 'Track Drop'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimers */}
      <div className="p-4 rounded-xl bg-vybe-card border border-vybe-border/60 text-[11px] text-slate-400 leading-relaxed space-y-1">
        <span className="font-bold text-slate-300 block">Integrity Notice:</span>
        <p>
          Ticket drop countdowns are keyed to announced organizer schedules. VYBE does not invent ticket inventory, sales quotas, or process direct financial payments. Always finalize purchases through official verified ticketing portals.
        </p>
      </div>

    </div>
  );
};
