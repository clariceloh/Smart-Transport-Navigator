import React, { useState } from 'react';
import { TransitRoute, SortOption } from '../types';

interface RouteResultsProps {
  routes: TransitRoute[];
  onSelectRoute: (route: TransitRoute) => void;
  origin: string;
  destination: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const RouteResults: React.FC<RouteResultsProps> = ({
  routes,
  onSelectRoute,
  origin,
  destination,
  sortBy,
  onSortChange
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortLabels: Record<SortOption, string> = {
    best_match: 'Best Match',
    fastest: 'Fastest Route',
    least_transfers: 'Least Transfers',
    least_walking: 'Least Walking'
  };

  const sortedRoutes = [...routes].sort((a, b) => {
    if (sortBy === 'fastest') {
      return a.totalDurationMinutes - b.totalDurationMinutes;
    }
    if (sortBy === 'least_transfers') {
      return a.segments.length - b.segments.length;
    }
    if (sortBy === 'least_walking') {
      const walkA = a.segments
        .filter((s) => s.mode === 'walk')
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      const walkB = b.segments
        .filter((s) => s.mode === 'walk')
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      return walkA - walkB;
    }
    return (b.isOptimal ? 1 : 0) - (a.isOptimal ? 1 : 0);
  });

  return (
    <section className="w-full md:w-8/12 bg-[#fdf8fd] p-4 md:p-6 overflow-y-auto flex flex-col gap-3">
      {/* Header and Sort */}
      <div className="flex justify-between items-end mb-2 relative">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1c1b1f] tracking-tight">
            Suggested Routes
          </h2>
          <p className="text-xs text-[#727783] mt-0.5">
            Real-time live departures from{' '}
            <span className="text-[#1c1b1f] font-medium">{origin}</span> to{' '}
            <span className="text-[#1c1b1f] font-medium">{destination}</span>
          </p>
        </div>

        <div className="relative">
          <span className="text-sm text-[#727783]">
            Sorted by:{' '}
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="text-[#1c1b1f] font-semibold cursor-pointer hover:text-[#004481] inline-flex items-center gap-0.5"
            >
              <span>{sortLabels[sortBy]}</span>
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </span>

          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#c1c6d3] rounded-lg shadow-xl py-1 z-30 min-w-[160px] animate-in fade-in zoom-in-95 duration-100">
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    onSortChange(key);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#f1ecf2] transition-colors cursor-pointer ${
                    sortBy === key ? 'text-[#004481] bg-[#d5e3ff]/30 font-bold' : 'text-[#1c1b1f]'
                  }`}
                >
                  <span>{sortLabels[key]}</span>
                  {sortBy === key && (
                    <span className="material-symbols-outlined text-[16px] text-[#004481]">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Routes List */}
      <div className="flex flex-col gap-4">
        {sortedRoutes.map((route) => {
          const isOptimal = route.isOptimal;
          const transferCount = route.segments.filter(
            (s) => s.mode === 'train' || s.mode === 'bus'
          ).length;

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route)}
              id={`route-card-${route.id}`}
              className={`bg-white rounded-xl p-4 relative overflow-hidden flex flex-col gap-3 cursor-pointer transition-all border ${
                isOptimal
                  ? 'border-[#004481] shadow-[0_4px_12px_rgba(0,68,129,0.1)] hover:shadow-[0_6px_18px_rgba(0,68,129,0.18)] ring-1 ring-[#004481]/20'
                  : 'border-[#c1c6d3] hover:border-[#727783] hover:bg-[#f7f2f8] shadow-xs'
              }`}
            >
              <div
                className={`absolute top-0 left-0 w-2 h-full ${
                  isOptimal ? 'bg-[#004481]' : 'bg-[#006e2a]'
                }`}
              />

              {isOptimal && (
                <div className="absolute top-0 right-0 bg-[#005baa] text-[#bbd4ff] text-[10px] font-bold px-2 py-1 rounded-bl-lg tracking-wide uppercase font-mono">
                  Most Optimal
                </div>
              )}

              {/* Time & Duration Header */}
              <div className="flex justify-between items-start pl-2">
                <div className="flex flex-col">
                  <span className="text-[28px] font-bold tracking-tight text-[#1c1b1f] leading-none">
                    {route.totalDurationMinutes}
                    <span className="text-xl font-semibold text-[#414751] ml-1">min</span>
                  </span>
                  <span className="text-sm text-[#414751] mt-1.5 font-normal">
                    {route.departureTime} — {route.arrivalTime}
                  </span>
                </div>

                <div className="text-right flex flex-col items-end">
                  {route.status === 'On Time' ? (
                    <span className="text-xs font-semibold text-[#006e2a] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#006e2a] animate-pulse" />
                      <span>On Time</span>
                    </span>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-[#ba1a1a] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
                        <span>{route.status}</span>
                      </span>
                      <span className="text-[10px] text-[#ba1a1a]">+7 min heavy traffic</span>
                    </div>
                  )}
                  <span className="text-lg md:text-xl font-extrabold text-[#004481] font-mono tracking-tight tabular-nums mt-0.5">
                    {route.fare}
                  </span>
                </div>
              </div>

              {/* Segments Visual Bar */}
              <div className="flex items-center gap-2 pl-2 overflow-x-auto pb-1 no-scrollbar">
                {route.segments.map((seg, sIdx) => (
                  <React.Fragment key={seg.id || sIdx}>
                    {seg.mode === 'walk' && (
                      <div className="flex items-center gap-1 bg-[#f1ecf2] px-2 py-1 rounded-md text-xs text-[#414751] shrink-0">
                        <span className="material-symbols-outlined text-[15px]">directions_walk</span>
                        <span>{seg.durationMinutes} min</span>
                      </div>
                    )}

                    {seg.mode === 'train' && (
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold shrink-0 border"
                        style={{
                          backgroundColor: seg.colorBg || '#FDECE8',
                          color: seg.colorText || '#E76F51',
                          borderColor: seg.colorBorder || '#F4A261'
                        }}
                      >
                        <span className="material-symbols-outlined text-[15px]">train</span>
                        <span>{seg.label}</span>
                        {seg.numStops && (
                          <span className="text-[10px] opacity-85 font-normal">
                            ({seg.numStops} stops)
                          </span>
                        )}
                      </div>
                    )}

                    {seg.mode === 'bus' && (
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold shrink-0 border"
                        style={{
                          backgroundColor: seg.colorBg || '#83fc94',
                          color: seg.colorText || '#00752d',
                          borderColor: seg.colorBorder || '#006e2a'
                        }}
                      >
                        <span className="material-symbols-outlined text-[15px]">directions_bus</span>
                        <span>Bus {seg.label}</span>
                        {seg.numStops && (
                          <span className="text-[10px] opacity-85 font-normal">
                            ({seg.numStops} stops)
                          </span>
                        )}
                      </div>
                    )}

                    {sIdx < route.segments.length - 1 && (
                      <span className="material-symbols-outlined text-[#727783] text-[14px] shrink-0">
                        chevron_right
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Badges & Meta Footer */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#f1ecf2] pl-2 text-xs text-[#727783] gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                    <span>{transferCount > 1 ? `${transferCount - 1} Transfers` : 'Direct Route'}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#006e2a]">
                    <span className="material-symbols-outlined text-[16px]">eco</span>
                    <span>{route.carbonSaved}</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                    <span>{route.calories} kcal</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#004481] font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Navigation Steps</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transit Network Map Preview Card */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#c1c6d3] flex flex-col gap-3 shadow-xs">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004481] text-[20px]">map</span>
            <span className="font-bold text-sm text-[#1c1b1f]">Singapore Transit Network Overview</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 bg-[#83fc94]/30 text-[#006e2a] font-bold rounded-full">
            ● Live GPS Telemetry
          </span>
        </div>

        <div className="relative w-full h-44 bg-[#f1ecf2] rounded-lg overflow-hidden border border-[#c1c6d3] flex items-center justify-center p-2">
          {/* Stylized SVG Transit Map */}
          <svg viewBox="0 0 700 200" className="w-full h-full">
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e1e7" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* MRT Lines */}
            {/* NSL - Red */}
            <path
              d="M 120 20 L 220 80 L 320 140 L 400 170"
              stroke="#d42e12"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* EWL - Green */}
            <path
              d="M 50 140 L 220 140 L 400 140 L 620 140"
              stroke="#009645"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Airport Branch */}
            <path
              d="M 520 140 L 600 80 L 660 80"
              stroke="#009645"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="4 2"
              fill="none"
            />
            {/* CCL - Orange */}
            <path
              d="M 200 40 Q 380 30 450 120 T 320 180"
              stroke="#fa9e0d"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* DTL - Blue */}
            <path
              d="M 100 60 L 240 100 L 420 100 L 580 160"
              stroke="#005ec4"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* TEL - Brown */}
            <path
              d="M 260 20 L 300 90 L 360 160 L 520 180"
              stroke="#9D5B25"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Stations */}
            <circle cx="120" cy="20" r="4" fill="#ffffff" stroke="#d42e12" strokeWidth="2" />
            <text x="125" y="18" fill="#414751" fontSize="9" fontWeight="bold">Woodlands</text>

            <circle cx="220" cy="80" r="5" fill="#ffffff" stroke="#d42e12" strokeWidth="2.5" />
            <text x="230" y="80" fill="#414751" fontSize="9" fontWeight="bold">Toa Payoh (Origin)</text>

            <circle cx="320" cy="140" r="5.5" fill="#ffffff" stroke="#004481" strokeWidth="3" />
            <text x="325" y="135" fill="#004481" fontSize="10" fontWeight="extrabold">City Hall Interchange</text>

            <circle cx="520" cy="140" r="5" fill="#ffffff" stroke="#009645" strokeWidth="2.5" />
            <text x="500" y="160" fill="#414751" fontSize="9" fontWeight="bold">Tanah Merah</text>

            <circle cx="660" cy="80" r="6" fill="#83fc94" stroke="#006e2a" strokeWidth="3" />
            <text x="590" y="70" fill="#006e2a" fontSize="10" fontWeight="extrabold">Changi Airport T3 (Dest)</text>

            {/* Pulsing Moving Vehicle Dot */}
            <circle cx="280" cy="115" r="4.5" fill="#004481">
              <animate attributeName="r" values="3.5;6;3.5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>

          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-[#414751] border border-[#c1c6d3]">
            Active Live Journey: <strong className="text-[#004481]">Toa Payoh → City Hall → Changi T3</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
