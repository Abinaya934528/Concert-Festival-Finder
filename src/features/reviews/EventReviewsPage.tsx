import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventReview } from '../../types';
import { 
  Heart, 
  Star, 
  Plus, 
  Flag, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  Volume2, 
  MapPin,
  Filter
} from 'lucide-react';

export const EventReviewsPage: React.FC = () => {
  const { reviews, addReview, allEvents, showToast } = useApp();

  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('All');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // New review form state
  const [formEventId, setFormEventId] = useState(allEvents[0]?.id || '');
  const [authorName, setAuthorName] = useState('');
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingMusic, setRatingMusic] = useState(5);
  const [ratingVenue, setRatingVenue] = useState(4);
  const [ratingCrowd, setRatingCrowd] = useState(5);
  const [ratingAccessibility, setRatingAccessibility] = useState(4);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [topTip, setTopTip] = useState('');

  const filteredReviews = reviews.filter(r => {
    if (selectedEventFilter === 'All') return true;
    return r.eventId === selectedEventFilter;
  });

  const handleReport = (reviewId: string) => {
    showToast('Review flagged for community moderation review. Thank you for maintaining safety.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const matchedEvent = allEvents.find(ev => ev.id === formEventId) || allEvents[0];

    addReview({
      eventId: matchedEvent.id,
      eventName: matchedEvent.title,
      authorName: authorName.trim() || 'Fellow Music Explorer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      ratingOverall,
      ratingMusic,
      ratingVenue,
      ratingCrowd,
      ratingAccessibility,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      topTip: topTip.trim() || 'Arrive 45 mins before headliner to avoid mainstage surge.'
    });

    setShowReviewModal(false);
    setReviewTitle('');
    setReviewComment('');
    setTopTip('');
    setAuthorName('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-lime/15 border border-vybe-lime/30 text-xs font-mono text-vybe-lime mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Attendee Survival Intel & Acoustics</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Event Reviews & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real feedback from past festival and concert attendees. Verified sound quality ratings, gate entry advice, and acoustic survival tips.
          </p>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="px-5 py-3 rounded-2xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write Review</span>
        </button>
      </div>

      {/* Event Filter Bar */}
      <div className="p-4 rounded-2xl bg-vybe-card border border-vybe-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Filter className="w-4 h-4 text-vybe-lime" />
          <span>Filter By Event:</span>
        </div>

        <select
          value={selectedEventFilter}
          onChange={(e) => setSelectedEventFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-200 focus:outline-none focus:border-vybe-lime"
        >
          <option value="All">All Events ({reviews.length})</option>
          {allEvents.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-6">
        {filteredReviews.map(review => (
          <div 
            key={review.id}
            className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-4"
          >
            {/* Top Bar: Author, Event & Overall Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-vybe-border pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={review.avatar} 
                  alt={review.authorName} 
                  className="w-10 h-10 rounded-full object-cover border border-vybe-border"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{review.authorName}</span>
                    {review.isDemoSample && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-vybe-surface text-slate-400 border border-vybe-border">
                        Sample Attendee
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Reviewed: <strong className="text-slate-200">{review.eventName}</strong> • {review.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.ratingOverall ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} 
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleReport(review.id)}
                  className="text-slate-500 hover:text-amber-400 p-1.5 rounded-lg hover:bg-vybe-surface"
                  title="Report inappropriate review"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dimensional Score Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-slate-300">
                Music: <strong className="text-vybe-lime">{review.ratingMusic}/5</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-slate-300">
                Venue Acoustics: <strong className="text-vybe-cyan">{review.ratingVenue}/5</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-slate-300">
                Crowd Vibe: <strong className="text-vybe-violet-glow">{review.ratingCrowd}/5</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-slate-300">
                Access: <strong className="text-emerald-400">{review.ratingAccessibility}/5</strong>
              </span>
            </div>

            {/* Review Title & Body */}
            <div className="space-y-1.5">
              <h4 className="font-display font-bold text-base text-slate-100">
                "{review.title}"
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {review.comment}
              </p>
            </div>

            {/* Attendee Survival Tip Box */}
            {review.topTip && (
              <div className="p-3.5 rounded-2xl bg-vybe-surface border border-vybe-lime/30 flex items-start gap-2.5 text-xs">
                <Lightbulb className="w-4 h-4 text-vybe-lime flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200 block">Attendee Pro-Tip:</span>
                  <p className="text-slate-300 mt-0.5">{review.topTip}</p>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-lg max-h-[90vh] rounded-3xl glass-panel p-6 border border-vybe-border space-y-4 overflow-y-auto custom-scrollbar my-auto"
          >
            <h3 className="font-display font-extrabold text-xl text-slate-100">
              Submit Event Review
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Attended Event</label>
              <select
                value={formEventId}
                onChange={(e) => setFormEventId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 font-bold"
              >
                {allEvents.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Your Display Name</label>
              <input
                type="text"
                placeholder="e.g. Maya S."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100"
              />
            </div>

            {/* Multi-Dimensional Ratings Sliders */}
            <div className="space-y-3 p-3.5 rounded-2xl bg-vybe-surface border border-vybe-border">
              <span className="text-xs font-bold text-slate-200 block">Experience Dimensions</span>

              {[
                { label: 'Overall Experience', val: ratingOverall, set: setRatingOverall },
                { label: 'Music & Performance Quality', val: ratingMusic, set: setRatingMusic },
                { label: 'Venue & Acoustic Clarity', val: ratingVenue, set: setRatingVenue },
                { label: 'Crowd Energy & Respect', val: ratingCrowd, set: setRatingCrowd },
                { label: 'Accessibility & Navigation', val: ratingAccessibility, set: setRatingAccessibility },
              ].map((dim, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{dim.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => dim.set(n)}
                        className={`w-6 h-6 rounded text-xs font-bold font-mono ${
                          dim.val >= n ? 'bg-vybe-lime text-black' : 'bg-vybe-card text-slate-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Review Title & Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Headline</label>
              <input
                type="text"
                placeholder="e.g. Breathtaking sunset set, but enter via Gate 2"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Detailed Review</label>
              <textarea
                placeholder="Share thoughts on sound mix, crowd vibe, food prices, and set pacing..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                rows={3}
                className="w-full p-3 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Survival Tip for Future Attendees</label>
              <input
                type="text"
                placeholder="e.g. Bring earplugs for stage front and use the metro shuttle"
                value={topTip}
                onChange={(e) => setTopTip(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl bg-vybe-surface text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime"
              >
                Post Review
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
