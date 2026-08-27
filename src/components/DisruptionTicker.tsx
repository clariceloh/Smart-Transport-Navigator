import React, { useState, useEffect } from 'react';
import { INCIDENTS } from '../data/transitData';
import { IncidentAlert } from '../types';

interface DisruptionTickerProps {
  onOpenAlertsTab: () => void;
  onOpenIncidentDetail: (incident: IncidentAlert) => void;
}

export const DisruptionTicker: React.FC<DisruptionTickerProps> = ({
  onOpenAlertsTab,
  onOpenIncidentDetail
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const categoryBadges = {
    traffic: { badge: 'TRAFFIC ADVISORY', bg: 'bg-[#ffdad6]', text: 'text-[#93000a]' },
    weather: { badge: 'WEATHER ADVISORY', bg: 'bg-[#ffeed3]', text: 'text-[#5f3c00]' },
    rail: { badge: 'RAIL STATUS', bg: 'bg-[#83fc94]', text: 'text-[#00752d]' }
  };

  useEffect(() => {
    if (isPaused || isExpanded || isDismissed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INCIDENTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, isExpanded, isDismissed]);

  if (isDismissed) {
    return (
      <div className="bg-[#f1ecf2] border-b border-[#c1c6d3] px-4 py-1 flex items-center justify-between text-xs text-[#414751]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
          <span className="font-semibold text-[#1c1b1f]">Live Network Advisory Bar Minimized</span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-[#004481] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
        >
          <span>Restore Live Ticker</span>
          <span className="material-symbols-outlined text-[14px]">expand_more</span>
        </button>
      </div>
    );
  }

  const current = INCIDENTS[currentIndex];
  const cat = categoryBadges[current.category];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-[#1c1b1f] text-white border-b border-[#313034] z-40 transition-all"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2 flex items-center justify-between gap-3 text-xs">
        {/* Left icon and category */}
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <span className="p-1 rounded-md bg-white/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] animate-pulse">
              warning
            </span>
          </span>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 font-mono tracking-wider ${cat.bg} ${cat.text}`}
          >
            {cat.badge}
          </span>

          {/* Current message */}
          <div
            onClick={() => onOpenIncidentDetail(current)}
            className="flex items-center gap-2 truncate cursor-pointer group hover:text-[#bbd4ff] transition-colors"
          >
            <span className="font-bold text-white group-hover:text-[#bbd4ff] truncate">
              {current.title}
            </span>
            <span className="hidden lg:inline text-white/70 font-light truncate">
              — {current.detail}
            </span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-white/10 text-white/90 font-mono shrink-0 hidden sm:inline">
              {current.impactBadge}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + INCIDENTS.length) % INCIDENTS.length)}
              title="Previous alert"
              className="p-1 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            </button>
            <span className="text-[11px] font-mono px-1 text-white/60">
              {currentIndex + 1}/{INCIDENTS.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % INCIDENTS.length)}
              title="Next alert"
              className="p-1 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Radar' : 'All Advisories'}</span>
            <span className="material-symbols-outlined text-[14px]">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          <button
            onClick={onOpenAlertsTab}
            className="text-xs bg-[#004481] hover:bg-[#005baa] text-white font-medium px-2.5 py-1 rounded-lg transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
          >
            <span>Full Feed</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            title="Dismiss notification bar"
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      {/* Expanded Grid */}
      {isExpanded && (
        <div className="bg-[#262529] border-t border-white/10 p-4 md:px-8 max-w-[1440px] mx-auto animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Live Disruption Radar & Weather Station</span>
              <span className="text-xs text-white/50 font-mono">• Updated directly from LTA & SMRT OCC</span>
            </div>
            <button
              onClick={onOpenAlertsTab}
              className="text-xs text-[#a6c8ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Open Incident Management Center
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {INCIDENTS.map((inc, index) => {
              const catBadge = categoryBadges[inc.category];
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    onOpenIncidentDetail(inc);
                  }}
                  className={`bg-[#313034] rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    currentIndex === index
                      ? 'border-[#a6c8ff] ring-1 ring-[#a6c8ff]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-start">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${catBadge.bg} ${catBadge.text}`}
                      >
                        {catBadge.badge}
                      </span>
                      <span className="text-[10px] text-white/50 font-mono">{inc.time}</span>
                    </div>
                    <h4 className="font-bold text-[13px] text-white leading-snug">{inc.title}</h4>
                    <p className="text-xs text-white/70 line-clamp-2">{inc.detail}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[11px]">
                    <span className="text-white/50">{inc.affectedCorridor}</span>
                    <span className="text-[#83fc94] font-mono font-medium">{inc.impactBadge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
