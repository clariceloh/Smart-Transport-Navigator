import React, { useState, useRef, useEffect } from 'react';
import { LOCATIONS } from '../data/transitData';
import { TransportMode, ScheduleType, WeatherType } from '../types';

interface RoutePlannerSidebarProps {
  origin: string;
  destination: string;
  onOriginChange: (val: string) => void;
  onDestinationChange: (val: string) => void;
  onSwapLocations: () => void;
  scheduleType: ScheduleType;
  onScheduleTypeChange: (type: ScheduleType) => void;
  dateString: string;
  timeString: string;
  onDateTimeChange: (date: string, time: string) => void;
  transportMode: TransportMode;
  onTransportModeChange: (mode: TransportMode) => void;
  onPlanRoute: () => void;
  isPlanning: boolean;
}

export const RoutePlannerSidebar: React.FC<RoutePlannerSidebarProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSwapLocations,
  scheduleType,
  onScheduleTypeChange,
  dateString,
  timeString,
  onDateTimeChange,
  transportMode,
  onTransportModeChange,
  onPlanRoute,
  isPlanning
}) => {
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [weatherState, setWeatherState] = useState<WeatherType>('sunny');
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOriginLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(origin.toLowerCase()) ||
      loc.code.toLowerCase().includes(origin.toLowerCase()) ||
      loc.address.toLowerCase().includes(origin.toLowerCase())
  );

  const filteredDestLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(destination.toLowerCase()) ||
      loc.code.toLowerCase().includes(destination.toLowerCase()) ||
      loc.address.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <aside className="w-full md:w-4/12 bg-white md:border-r border-[#c1c6d3] p-4 md:p-6 flex flex-col gap-5 shrink-0 overflow-y-auto shadow-xs">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold text-[#1c1b1f] tracking-tight flex items-center justify-between">
          <span>Journey Planner</span>
          <span className="text-xs px-2 py-0.5 bg-[#d5e3ff] text-[#004481] rounded-full font-mono font-semibold">
            SG Transit
          </span>
        </h1>
        <p className="text-xs text-[#727783]">
          Multi-modal transit routing, live MRT telemetry & bus crowd forecast.
        </p>
      </div>

      {/* Origin & Destination Inputs with Swap */}
      <div className="relative flex flex-col gap-2">
        {/* Origin */}
        <div ref={originRef} id="origin-container" className="relative z-20">
          <div className="flex items-center gap-2 bg-[#f7f2f8] border border-[#c1c6d3] rounded-xl px-3 py-2.5 focus-within:border-[#004481] focus-within:ring-2 focus-within:ring-[#004481]/15 transition-all">
            <span className="material-symbols-outlined text-[#004481] text-[20px]">my_location</span>
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                onOriginChange(e.target.value);
                setShowOriginSuggestions(true);
              }}
              onFocus={() => setShowOriginSuggestions(true)}
              placeholder="Origin or current location"
              id="origin-input"
              className="w-full bg-transparent text-sm font-medium text-[#1c1b1f] outline-none"
            />
            {origin && (
              <button
                type="button"
                onClick={() => onOriginChange('')}
                className="text-[#727783] hover:text-[#1c1b1f] p-1 cursor-pointer"
                title="Clear origin"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
          </div>

          {showOriginSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#c1c6d3] rounded-xl shadow-xl max-h-56 overflow-y-auto z-40 py-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#727783] uppercase tracking-wider bg-[#f7f2f8]">
                Suggested Stations & Hubs
              </div>
              {filteredOriginLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => {
                    onOriginChange(loc.name);
                    setShowOriginSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-[#f1ecf2] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1c1b1f]">{loc.name}</span>
                    <span className="text-[10px] text-[#727783]">{loc.address}</span>
                  </div>
                  <div className="flex gap-1">
                    {loc.lines.map((l) => (
                      <span
                        key={l}
                        className="px-1.5 py-0.2 bg-[#f1ecf2] text-[#414751] text-[10px] font-mono font-bold rounded"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div ref={destRef} id="dest-container" className="relative z-10 mt-1">
          <div className="flex items-center gap-2 bg-[#f7f2f8] border border-[#c1c6d3] rounded-xl px-3 py-2.5 focus-within:border-[#004481] focus-within:ring-2 focus-within:ring-[#004481]/15 transition-all">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">location_on</span>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                onDestinationChange(e.target.value);
                setShowDestSuggestions(true);
              }}
              onFocus={() => setShowDestSuggestions(true)}
              placeholder="Destination or address"
              id="destination-input"
              className="w-full bg-transparent text-sm font-medium text-[#1c1b1f] outline-none"
            />
            {destination && (
              <button
                type="button"
                onClick={() => onDestinationChange('')}
                className="text-[#727783] hover:text-[#1c1b1f] p-1 cursor-pointer"
                title="Clear destination"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
          </div>

          {showDestSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#c1c6d3] rounded-xl shadow-xl max-h-56 overflow-y-auto z-40 py-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#727783] uppercase tracking-wider bg-[#f7f2f8]">
                Suggested Stations & Landmarks
              </div>
              {filteredDestLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => {
                    onDestinationChange(loc.name);
                    setShowDestSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-[#f1ecf2] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1c1b1f]">{loc.name}</span>
                    <span className="text-[10px] text-[#727783]">{loc.address}</span>
                  </div>
                  <div className="flex gap-1">
                    {loc.lines.map((l) => (
                      <span
                        key={l}
                        className="px-1.5 py-0.2 bg-[#f1ecf2] text-[#414751] text-[10px] font-mono font-bold rounded"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap button */}
        <button
          type="button"
          onClick={onSwapLocations}
          title="Swap origin and destination"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#e5e1e7] hover:bg-[#c1c6d3] text-[#414751] p-1.5 rounded-full shadow-sm z-30 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">swap_vert</span>
        </button>
      </div>

      {/* Quick Preset Location Chips */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: '📍 Home', val: 'Current Location' },
          { label: '✈️ Changi T3', val: 'Changi Airport T3' },
          { label: '🛍️ Orchard', val: 'Orchard MRT Station' },
          { label: '🏙️ Raffles Pl', val: 'Raffles Place MRT' },
          { label: '🏢 MBS', val: 'Marina Bay Sands' }
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onDestinationChange(item.val)}
            className="text-[11px] font-medium px-2.5 py-1 bg-[#f1ecf2] hover:bg-[#d5e3ff] hover:text-[#004481] rounded-full text-[#414751] transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Schedule & Time */}
      <div className="flex flex-col gap-2 pt-1 border-t border-[#f1ecf2]">
        <div className="flex items-center justify-between text-xs font-semibold text-[#414751]">
          <span>Schedule Departure</span>
          <div className="flex bg-[#f1ecf2] p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => onScheduleTypeChange('depart')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                scheduleType === 'depart' ? 'bg-white text-[#004481] font-bold shadow-xs' : 'text-[#727783]'
              }`}
            >
              Depart
            </button>
            <button
              type="button"
              onClick={() => onScheduleTypeChange('arrive')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                scheduleType === 'arrive' ? 'bg-white text-[#004481] font-bold shadow-xs' : 'text-[#727783]'
              }`}
            >
              Arrive
            </button>
          </div>
        </div>

        {/* Date / Time button triggering modal */}
        <button
          type="button"
          onClick={() => setShowTimeModal(true)}
          className="flex items-center justify-between bg-[#f7f2f8] border border-[#c1c6d3] rounded-xl px-3 py-2 text-xs text-[#1c1b1f] hover:border-[#004481] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004481] text-[18px]">schedule</span>
            <span className="font-semibold">
              {dateString} • {timeString}
            </span>
          </div>
          <span className="text-[10px] text-[#004481] font-bold uppercase tracking-wider">
            Change
          </span>
        </button>
      </div>

      {/* Mode Selector Chips */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-[#f1ecf2]">
        <label className="text-xs font-semibold text-[#414751]">Preferred Transit Mode</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onTransportModeChange('mixed')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              transportMode === 'mixed'
                ? 'bg-[#004481] text-white border border-[#004481] shadow-sm'
                : 'bg-white border border-[#c1c6d3] text-[#414751] hover:bg-[#e5e1e7]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
            <span>All Transit</span>
          </button>
          <button
            type="button"
            onClick={() => onTransportModeChange('bus_only')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              transportMode === 'bus_only'
                ? 'bg-[#004481] text-white border border-[#004481] shadow-sm'
                : 'bg-white border border-[#c1c6d3] text-[#414751] hover:bg-[#e5e1e7]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">directions_bus</span>
            <span>Bus Only</span>
          </button>
          <button
            type="button"
            onClick={() => onTransportModeChange('train_only')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              transportMode === 'train_only'
                ? 'bg-[#004481] text-white border border-[#004481] shadow-sm'
                : 'bg-white border border-[#c1c6d3] text-[#414751] hover:bg-[#e5e1e7]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">train</span>
            <span>Train Only</span>
          </button>
        </div>
      </div>

      {/* Plan Route CTA */}
      <button
        type="button"
        onClick={onPlanRoute}
        disabled={isPlanning}
        id="plan-route-cta"
        className="mt-auto w-full bg-[#004481] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#005baa] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-75"
      >
        {isPlanning ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Calculating Optimal Routes...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Plan Route</span>
          </>
        )}
      </button>

      {/* Weather widget */}
      <div
        onClick={() => setShowWeatherDetail(!showWeatherDetail)}
        className="bg-white border border-[#c1c6d3] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-[#727783] transition-all shadow-xs"
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-[#5f3c00] text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {weatherState === 'sunny' ? 'partly_cloudy_day' : 'rainy'}
          </span>
          <div>
            <div className="text-xs font-semibold text-[#1c1b1f] flex items-center gap-1.5">
              <span>{weatherState === 'sunny' ? 'Mostly Sunny' : 'Passing Showers'}</span>
              <span className="text-[10px] text-[#006e2a] font-normal underline">Tap to preview</span>
            </div>
            <div className="text-xs text-[#414751]">
              {weatherState === 'sunny'
                ? 'Optimal travel conditions'
                : 'Sheltered MRT walkways recommended'}
            </div>
          </div>
        </div>
        <div className="text-xl font-bold text-[#1c1b1f] font-mono">
          {weatherState === 'sunny' ? '31°' : '27°'}
        </div>
      </div>

      {showWeatherDetail && (
        <div className="bg-[#f1ecf2] border border-[#c1c6d3] rounded-lg p-3 text-xs flex flex-col gap-2 animate-in fade-in duration-150">
          <div className="flex justify-between items-center font-bold text-[#1c1b1f]">
            <span>Live Weather & Transit Impact</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setWeatherState(weatherState === 'sunny' ? 'rain' : 'sunny');
              }}
              className="text-[11px] bg-white border border-[#c1c6d3] px-2 py-0.5 rounded text-[#004481] hover:bg-[#e5e1e7] cursor-pointer"
            >
              Simulate {weatherState === 'sunny' ? 'Rain' : 'Sunny'}
            </button>
          </div>
          <p className="text-[#414751]">
            {weatherState === 'sunny'
              ? 'Clear visibility across expressway bus corridors (PIE/TPE). SMRT trains operating at peak timetable frequency.'
              : 'Wet platform protocols active. Free umbrella sharing lockers available at Bishan, Jurong East, and Changi Airport.'}
          </p>
        </div>
      )}

      {/* Quick Time Schedule Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-[#c1c6d3] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-[#c1c6d3] pb-3">
              <h3 className="font-bold text-[#1c1b1f] text-base">Select Departure Time</h3>
              <button
                onClick={() => setShowTimeModal(false)}
                className="text-[#727783] hover:text-[#1c1b1f] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-[#414751]">Quick Time Shortcuts</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Now', time: 'Now', date: 'Today' },
                  { label: '+15 min', time: '10:30 AM', date: 'Today' },
                  { label: '+30 min', time: '10:45 AM', date: 'Today' },
                  { label: '12:00 PM', time: '12:00 PM', date: 'Today' },
                  { label: '5:30 PM', time: '5:30 PM', date: 'Today' },
                  { label: 'Tomorrow', time: '08:30 AM', date: 'Tomorrow' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onDateTimeChange(item.date, item.time);
                      setShowTimeModal(false);
                    }}
                    className="p-2 text-xs font-medium border border-[#c1c6d3] rounded-lg hover:border-[#004481] hover:bg-[#d5e3ff]/30 text-center transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTimeModal(false)}
              className="w-full bg-[#004481] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#005baa] cursor-pointer"
            >
              Apply Schedule
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
