import React, { useState } from 'react';
import { SavedRoute, TransportMode } from '../types';

interface SavedRoutesTabProps {
  savedRoutes: SavedRoute[];
  onPlanSavedRoute: (origin: string, destination: string, mode: TransportMode) => void;
  onDeleteSavedRoute: (id: string) => void;
  onAddCustomSave: (newRoute: { title: string; origin: string; destination: string; mode: TransportMode; duration: string; tags: string[] }) => void;
}

export const SavedRoutesTab: React.FC<SavedRoutesTabProps> = ({
  savedRoutes,
  onPlanSavedRoute,
  onDeleteSavedRoute,
  onAddCustomSave
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newDest, setNewDest] = useState('');
  const [newMode, setNewMode] = useState<TransportMode>('mixed');
  const [newDuration, setNewDuration] = useState('30 mins');
  const [newTag, setNewTag] = useState('Daily');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newOrigin || !newDest) return;
    onAddCustomSave({
      title: newTitle,
      origin: newOrigin,
      destination: newDest,
      mode: newMode,
      duration: newDuration,
      tags: [newTag, 'Personal']
    });
    setNewTitle('');
    setNewOrigin('');
    setNewDest('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#c1c6d3] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1b1f]">
            Saved Commutes & Favorite Places
          </h2>
          <p className="text-sm text-[#414751] mt-1">
            Quick 1-tap route planner launch for frequent journeys, airport transfers, and daily transit.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#004481] hover:bg-[#005baa] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Favorite</span>
        </button>
      </div>

      {/* Grid of Saved Commutes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedRoutes.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-5 border border-[#c1c6d3] hover:border-[#004481] hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-[#1c1b1f]">{item.title}</h3>
                <button
                  onClick={() => onDeleteSavedRoute(item.id)}
                  title="Remove saved commute"
                  className="text-[#727783] hover:text-[#ba1a1a] transition-colors p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-1.5 text-xs text-[#414751]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#727783]">
                    my_location
                  </span>
                  <span>
                    From: <strong className="text-[#1c1b1f]">{item.origin}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                    location_on
                  </span>
                  <span>
                    To: <strong className="text-[#1c1b1f]">{item.destination}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="bg-[#f1ecf2] text-[#414751] text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                <span className="bg-[#d5e3ff] text-[#001c3b] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  ⏱ {item.usualDuration}
                </span>
              </div>
            </div>

            <button
              onClick={() => onPlanSavedRoute(item.origin, item.destination, item.preferredMode)}
              className="w-full bg-[#f7f2f8] hover:bg-[#004481] hover:text-white text-[#004481] py-2 rounded-lg text-xs font-bold border border-[#c1c6d3] hover:border-[#004481] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">directions</span>
              <span>Plan This Journey</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add New Favorite Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c1c6d3] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-[#c1c6d3] pb-3">
              <h3 className="font-bold text-[#1c1b1f] text-lg">Add Favorite Commute</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#727783] hover:text-[#1c1b1f] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#414751] block mb-1">
                  Commute Label / Nickname
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Daily Gym Session, University Shuttle"
                  required
                  className="w-full border border-[#c1c6d3] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#004481]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#414751] block mb-1">Origin</label>
                <input
                  type="text"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  placeholder="e.g. Toa Payoh Block 178"
                  required
                  className="w-full border border-[#c1c6d3] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#004481]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#414751] block mb-1">Destination</label>
                <input
                  type="text"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  placeholder="e.g. Singapore Botanic Gardens"
                  required
                  className="w-full border border-[#c1c6d3] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#004481]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#414751] block mb-1">Category Tag</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full border border-[#c1c6d3] rounded-lg px-2.5 py-2 text-xs outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Work">Work</option>
                    <option value="Airport">Airport</option>
                    <option value="Leisure">Leisure</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#414751] block mb-1">Est. Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="35 mins"
                    className="w-full border border-[#c1c6d3] rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-lg text-xs font-bold text-[#414751] border border-[#c1c6d3] hover:bg-[#f1ecf2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#004481] hover:bg-[#005baa] text-white py-2.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Save Commute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
