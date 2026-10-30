import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MemoryCapsule } from '../../types';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Star, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Quote, 
  Download, 
  AlertCircle,
  FileImage
} from 'lucide-react';

export const MemoryCapsulePage: React.FC = () => {
  const { memories, saveMemory, deleteMemory, allEvents, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(allEvents[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [favoriteMoment, setFavoriteMoment] = useState('');
  const [bestSet, setBestSet] = useState('');
  const [memorableQuote, setMemorableQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [newPhotoInput, setNewPhotoInput] = useState('');

  const selectedEvent = allEvents.find(e => e.id === selectedEventId) || allEvents[0];

  const handleAddPhoto = () => {
    if (newPhotoInput.trim()) {
      if (photoUrls.length >= 4) {
        showToast('Maximum 4 photos per memory card to preserve browser storage.');
        return;
      }
      setPhotoUrls([...photoUrls, newPhotoInput.trim()]);
      setNewPhotoInput('');
    }
  };

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
    });
  };

  const handleImageFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file too large! Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          if (photoUrls.length >= 4) {
            showToast('Maximum 4 photos per memory card.');
            return;
          }
          const compressed = await compressImage(reader.result);
          setPhotoUrls(prev => [...prev, compressed]);
          showToast('Photo added and optimized for local memory storage!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const newMem: MemoryCapsule = {
      id: `mem-${Date.now()}`,
      eventId: selectedEvent.id,
      eventName: selectedEvent.title,
      eventDate: new Date(selectedEvent.startDate).toLocaleDateString(),
      venue: selectedEvent.venueName,
      notes: notes.trim(),
      favoriteMoment: favoriteMoment.trim() || 'Collective singing during the encore',
      bestSet: bestSet.trim() || selectedEvent.artists[0] || 'Mainstage Finale',
      memorableQuote: memorableQuote.trim(),
      rating,
      photos: photoUrls.length > 0 ? photoUrls : [selectedEvent.coverImage],
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveMemory(newMem);
    setShowAddModal(false);
    setNotes('');
    setFavoriteMoment('');
    setBestSet('');
    setMemorableQuote('');
    setPhotoUrls([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-violet/20 border border-vybe-violet/40 text-xs font-mono text-vybe-violet-glow mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Digital Scrapbook & Keepsake Journal</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Festival Memory Capsule
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Immortalize your core music memories. Record your best live sets, crowd moments, quotes, and photos in your post-event journal.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Lock In New Memory</span>
          </button>
          
          {memories.length > 0 && (
            <button
              onClick={handlePrint}
              className="px-4 py-3 rounded-2xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5"
              title="Print memory page keepsake"
            >
              <Download className="w-4 h-4 text-vybe-cyan" />
              <span>Print Keepsake</span>
            </button>
          )}
        </div>
      </div>

      {/* Memory Timeline Grid */}
      <div className="space-y-8">
        {memories.map((mem, index) => (
          <article 
            key={mem.id}
            className="p-6 sm:p-8 rounded-3xl glass-panel border border-vybe-border/80 relative space-y-6 overflow-hidden print:border-black print:text-black"
          >
            {/* Top Bar: Event, Venue & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-vybe-border pb-4">
              <div>
                <span className="text-[11px] font-mono text-vybe-lime font-bold uppercase tracking-wider block">
                  Memory #{memories.length - index} • {mem.eventDate}
                </span>
                <h3 className="font-display font-extrabold text-2xl text-slate-100 mt-1">
                  {mem.eventName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-vybe-violet-glow" />
                  <span>{mem.venue}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < mem.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} 
                    />
                  ))}
                </div>

                <button
                  onClick={() => deleteMemory(mem.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-vybe-surface"
                  title="Delete memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photos Carousel / Grid */}
            {mem.photos && mem.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mem.photos.map((photo, i) => (
                  <div key={i} className="h-44 rounded-2xl overflow-hidden border border-vybe-border/60">
                    <img 
                      src={photo} 
                      alt="Festival snapshot" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Highlights & Best Set */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-vybe-surface border border-vybe-border/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Best Live Performance
                </span>
                <span className="font-display font-bold text-base text-vybe-cyan block">
                  {mem.bestSet}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-vybe-surface border border-vybe-border/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Favorite Crowd Moment
                </span>
                <span className="text-xs text-slate-200 block font-medium">
                  {mem.favoriteMoment}
                </span>
              </div>
            </div>

            {/* Journal Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Personal Recap</h4>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {mem.notes}
              </p>
            </div>

            {/* Memorable Quote */}
            {mem.memorableQuote && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-vybe-violet/15 to-transparent border-l-4 border-vybe-violet-glow flex items-start gap-3">
                <Quote className="w-5 h-5 text-vybe-violet-glow flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-200 italic font-serif">
                  "{mem.memorableQuote}"
                </p>
              </div>
            )}
          </article>
        ))}

        {memories.length === 0 && (
          <div className="p-12 rounded-3xl glass-card border border-vybe-border text-center space-y-4">
            <Camera className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-display font-bold text-xl text-slate-200">No Memories Saved Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              After you attend a concert or festival, log your favorite song, moments, and photos into your personal Memory Capsule.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-extrabold text-xs"
            >
              Add First Memory
            </button>
          </div>
        )}
      </div>

      {/* CREATE MEMORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <form 
            onSubmit={handleSubmitMemory}
            className="w-full max-w-lg max-h-[90vh] rounded-3xl glass-panel p-6 border border-vybe-border space-y-4 overflow-y-auto custom-scrollbar my-auto"
          >
            <h3 className="font-display font-extrabold text-xl text-slate-100">
              Lock In A Festival Memory
            </h3>

            {/* Select Event */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Select Attended Event</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 font-semibold focus:outline-none focus:border-vybe-lime"
              >
                {allEvents.map(e => (
                  <option key={e.id} value={e.id}>{e.title} ({e.city})</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Overall Experience Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`p-2 rounded-xl border text-xs font-bold flex-1 ${
                      rating >= num ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-vybe-surface border-vybe-border text-slate-500'
                    }`}
                  >
                    ★ {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Set & Moment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Best Performance</label>
                <input
                  type="text"
                  placeholder="e.g. Bonobo Live Ensemble"
                  value={bestSet}
                  onChange={(e) => setBestSet(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Favorite Moment</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset during the opening chord"
                  value={favoriteMoment}
                  onChange={(e) => setFavoriteMoment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
                />
              </div>
            </div>

            {/* Recap Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Personal Experience Notes</label>
              <textarea
                placeholder="What did it feel like? How was the acoustic clarity and the crowd energy?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
                rows={3}
                className="w-full p-3 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
              />
            </div>

            {/* Memorable Quote */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Memorable Quote / Lyric (Optional)</label>
              <input
                type="text"
                placeholder='e.g. "We belong right here in this sound."'
                value={memorableQuote}
                onChange={(e) => setMemorableQuote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
              />
            </div>

            {/* Local Photo Upload Warning & Input */}
            <div className="space-y-2 p-3.5 rounded-xl bg-vybe-surface border border-vybe-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">Add Local Photos (Max 4)</label>
                <span className="text-[10px] font-mono text-slate-400">{photoUrls.length}/4</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste image URL (Unsplash, etc.)..."
                  value={newPhotoInput}
                  onChange={(e) => setNewPhotoInput(e.target.value)}
                  className="flex-grow px-3 py-1.5 rounded-lg bg-vybe-card border border-vybe-border text-xs text-slate-200"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3 py-1.5 rounded-lg bg-vybe-card border border-vybe-border text-xs font-bold text-vybe-lime"
                >
                  Add URL
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="cursor-pointer text-xs font-bold text-vybe-cyan hover:underline flex items-center gap-1">
                  <FileImage className="w-3.5 h-3.5" />
                  <span>Choose Local File (&lt;2MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFilePick}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * Storage Note: Photos are encoded locally in your browser storage. Never upload sensitive personal documents.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-vybe-surface text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime"
              >
                Save Memory Capsule
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
