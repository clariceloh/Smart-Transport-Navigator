import React, { useState } from 'react';
import { TransitRoute } from '../types';

interface RouteModalProps {
  route: TransitRoute;
  onClose: () => void;
  onSaveRoute: (route: TransitRoute) => void;
  isSaved?: boolean;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  route,
  onClose,
  onSaveRoute,
  isSaved = false
}) => {
  const [expandedStops, setExpandedStops] = useState<Record<number, boolean>>({});
  const [isLiveGuidance, setIsLiveGuidance] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);

  const toggleStops = (idx: number) => {
    setExpandedStops((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Smart Transit Route: ${route.totalDurationMinutes} mins (${route.departureTime} - ${route.arrivalTime}) • Fare: ${route.fare}`
      );
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleGuidanceStep = () => {
    if (!isLiveGuidance) {
      setIsLiveGuidance(true);
      setActiveStepIndex(0);
    } else {
      if (activeStepIndex < route.detailedSteps.length - 1) {
        setActiveStepIndex((prev) => prev + 1);
      } else {
        setIsLiveGuidance(false);
        alert('You have reached your destination: Changi Airport T3!');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#c1c6d3] overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#c1c6d3] flex justify-between items-start bg-[#fdf8fd]">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-[#1c1b1f] tracking-tight">
                {route.totalDurationMinutes} mins
              </span>
              {route.isOptimal && (
                <span className="bg-[#005baa] text-[#bbd4ff] text-[11px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                  Most Optimal
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#414751] mt-1">
              <span>
                {route.departureTime} — {route.arrivalTime}
              </span>
              <span>•</span>
              <span className="font-semibold text-[#006e2a]">
                {route.status === 'On Time' ? '● On Time' : '● Minor Delay'}
              </span>
              <span>•</span>
              <span className="text-lg md:text-xl font-extrabold text-[#004481] font-mono tracking-tight tabular-nums">
                {route.fare}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSaveRoute(route)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#004481] text-white border-[#004481]'
                  : 'bg-white text-[#414751] border-[#c1c6d3] hover:bg-[#f1ecf2]'
              }`}
              title={isSaved ? 'Saved to commute' : 'Save route'}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white text-[#414751] border border-[#c1c6d3] hover:bg-[#f1ecf2] transition-colors cursor-pointer"
              title="Copy route details"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#727783] hover:text-[#1c1b1f] hover:bg-[#e5e1e7] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Live Guidance Alert Bar if Active */}
        {isLiveGuidance && (
          <div className="bg-[#004481] text-white px-4 py-2 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#83fc94] animate-ping" />
              <span className="font-bold">
                Live Turn-by-Turn Guidance Active — Step {activeStepIndex + 1} of{' '}
                {route.detailedSteps.length}
              </span>
            </div>
            <button
              onClick={() => setIsLiveGuidance(false)}
              className="text-white/80 hover:text-white underline text-[11px] cursor-pointer"
            >
              Stop Guidance
            </button>
          </div>
        )}

        {/* Toast feedback */}
        {copiedToast && (
          <div className="bg-[#1c1b1f] text-white text-xs px-4 py-1.5 text-center">
            ✓ Route summary copied to clipboard!
          </div>
        )}

        {/* Step-by-Step Timeline Body */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
          <div className="text-xs font-bold text-[#727783] uppercase tracking-wider">
            Step-by-Step Directions
          </div>

          <div className="relative pl-6 flex flex-col gap-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c1c6d3]">
            {route.detailedSteps.map((step, idx) => {
              const isActiveStep = isLiveGuidance && activeStepIndex === idx;
              const isPastStep = isLiveGuidance && activeStepIndex > idx;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col gap-1.5 transition-all p-3 rounded-xl ${
                    isActiveStep
                      ? 'bg-[#d5e3ff]/40 border border-[#004481] ring-1 ring-[#004481]'
                      : isPastStep
                      ? 'opacity-60 bg-[#f7f2f8]'
                      : 'hover:bg-[#f7f2f8]'
                  }`}
                >
                  {/* Timeline node icon */}
                  <div
                    className={`absolute -left-[27px] top-3.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                      isActiveStep
                        ? 'bg-[#004481] text-white animate-pulse'
                        : isPastStep
                        ? 'bg-[#006e2a] text-white'
                        : step.mode === 'train'
                        ? 'bg-[#E76F51] text-white'
                        : step.mode === 'bus'
                        ? 'bg-[#00752d] text-white'
                        : 'bg-[#727783] text-white'
                    }`}
                  >
                    {step.mode === 'walk' && (
                      <span className="material-symbols-outlined text-[14px]">directions_walk</span>
                    )}
                    {step.mode === 'train' && (
                      <span className="material-symbols-outlined text-[14px]">train</span>
                    )}
                    {step.mode === 'bus' && (
                      <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                    )}
                    {step.mode === 'destination' && (
                      <span className="material-symbols-outlined text-[14px]">flag</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#727783]">
                        {step.time}
                      </span>
                      {step.badge && (
                        <span
                          className="px-2 py-0.2 rounded text-[11px] font-bold text-white font-mono"
                          style={{ backgroundColor: step.badgeColor || '#004481' }}
                        >
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-[#727783]">{step.duration}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#1c1b1f] leading-snug">
                    {step.instruction}
                  </h4>
                  <p className="text-xs text-[#414751]">{step.detail}</p>

                  {/* Intermediate stops toggle */}
                  {step.intermediateStops && step.intermediateStops.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#c1c6d3]/60">
                      <button
                        onClick={() => toggleStops(idx)}
                        className="text-xs font-semibold text-[#004481] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>
                          {expandedStops[idx] ? 'Hide' : 'Show'}{' '}
                          {step.stopsCount || step.intermediateStops.length} intermediate stops
                        </span>
                        <span className="material-symbols-outlined text-[16px]">
                          {expandedStops[idx] ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {expandedStops[idx] && (
                        <div className="mt-2 pl-3 border-l-2 border-[#004481]/30 flex flex-col gap-1.5 animate-in fade-in duration-150">
                          <div className="text-[11px] font-semibold text-[#727783] mb-1.5 flex items-center justify-between">
                            <span>{step.stopsCount || step.intermediateStops.length} Intermediate Stops</span>
                            <span className="text-[10px] text-[#006e2a]">● Low Crowding Expected</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {step.intermediateStops.map((stopName, sI) => (
                              <span
                                key={sI}
                                className="px-2 py-1 bg-white border border-[#c1c6d3] text-[#1c1b1f] text-xs rounded-md shadow-2xs font-medium"
                              >
                                {stopName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="p-4 md:px-6 bg-[#f7f2f8] border-t border-[#c1c6d3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-[#414751]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#727783] uppercase font-bold">Total Fare</span>
              <span className="text-xl font-extrabold text-[#004481] font-mono tabular-nums">
                {route.fare}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#727783] uppercase font-bold">CO₂ Saved</span>
              <span className="text-xs font-bold text-[#006e2a]">{route.carbonSaved}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#727783] uppercase font-bold">Calories</span>
              <span className="text-xs font-bold text-[#1c1b1f]">{route.calories} kcal</span>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleGuidanceStep}
              className="w-full sm:w-auto bg-[#004481] hover:bg-[#005baa] text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isLiveGuidance ? 'check_circle' : 'navigation'}
              </span>
              <span>
                {isLiveGuidance
                  ? activeStepIndex < route.detailedSteps.length - 1
                    ? 'Next Step'
                    : 'Complete Trip'
                  : 'Start Live Guidance'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
