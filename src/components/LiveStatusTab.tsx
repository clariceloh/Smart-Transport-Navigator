import React, { useState } from 'react';
import { MRT_LINES, BUS_ARRIVALS_DATA } from '../data/transitData';
import { BusArrivalInfo } from '../types';

export const LiveStatusTab: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'mrt' | 'bus'>('mrt');
  const [expandedLine, setExpandedLine] = useState<string | null>(null);
  const [busStopCode, setBusStopCode] = useState('04111');

  const defaultArrivals: BusArrivalInfo[] = [
    {
      service: '168',
      destination: 'Changi Airport PTB3',
      nextBus: '2 min',
      nextNextBus: '11 min',
      type: 'Double Decker',
      crowd: 'Seats Available',
      wheelchair: true
    },
    {
      service: '190',
      destination: 'Choa Chu Kang Int',
      nextBus: '4 min',
      nextNextBus: '14 min',
      type: 'Double Decker',
      crowd: 'Standing Available',
      wheelchair: true
    },
    {
      service: '124',
      destination: "St. Michael's Ter",
      nextBus: '7 min',
      nextNextBus: '18 min',
      type: 'Single Deck',
      crowd: 'Seats Available',
      wheelchair: true
    },
    {
      service: '851',
      destination: 'Yishun Int',
      nextBus: '9 min',
      nextNextBus: '21 min',
      type: 'Double Decker',
      crowd: 'Limited Standing',
      wheelchair: true
    }
  ];

  const currentBusArrivals = BUS_ARRIVALS_DATA[busStopCode] || defaultArrivals;

  const busStopNames: Record<string, string> = {
    '04111': 'Opp City Hall Stn (04111)',
    '52081': 'Bef Lor 1 Toa Payoh (52081)',
    '95009': 'Changi Airport PTB3 (95009)',
    '08057': 'Dhoby Ghaut Stn (08057)'
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#c1c6d3] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#1c1b1f]">
              Live Transport Telemetry & OCC Status
            </h2>
            <span className="w-2.5 h-2.5 rounded-full bg-[#006e2a] animate-pulse" />
          </div>
          <p className="text-sm text-[#414751] mt-1">
            Real-time train line frequencies, platform congestion, and live bus arrival telemetry across Singapore.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedSubTab('mrt')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedSubTab === 'mrt'
                ? 'bg-[#004481] text-white shadow-xs'
                : 'bg-[#f1ecf2] text-[#414751] hover:bg-[#e5e1e7]'
            }`}
          >
            Train Network
          </button>
          <button
            onClick={() => setSelectedSubTab('bus')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedSubTab === 'bus'
                ? 'bg-[#004481] text-white shadow-xs'
                : 'bg-[#f1ecf2] text-[#414751] hover:bg-[#e5e1e7]'
            }`}
          >
            Bus Arrival Radar
          </button>
        </div>
      </div>

      {/* MRT Network Grid */}
      {selectedSubTab === 'mrt' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MRT_LINES.map((line) => {
            const isNormal = line.status === 'Normal Service';
            const isExpanded = expandedLine === line.lineCode;

            return (
              <div
                key={line.lineCode}
                onClick={() => setExpandedLine(isExpanded ? null : line.lineCode)}
                className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs ${
                  isExpanded
                    ? 'border-[#004481] ring-2 ring-[#004481]/20'
                    : 'border-[#c1c6d3] hover:border-[#727783]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="px-3 py-1 rounded-md text-xs font-bold font-mono text-white shadow-xs"
                      style={{ backgroundColor: line.color, color: line.textColor }}
                    >
                      {line.lineCode}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1c1b1f] text-sm">{line.name}</h3>
                      <span className="text-xs text-[#727783]">Frequency: {line.frequency}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isNormal ? 'bg-[#83fc94]/40 text-[#00752d]' : 'bg-[#ffdad6] text-[#93000a]'
                    }`}
                  >
                    {line.status}
                  </span>
                </div>

                {line.delayNotice && (
                  <div className="mt-3 bg-[#ffdad6]/60 border border-[#ffb4ab] rounded-lg p-2 text-xs text-[#93000a]">
                    {line.delayNotice}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-[#f1ecf2] flex justify-between items-center text-[11px] text-[#727783]">
                  <span>Updated {line.lastUpdated}</span>
                  <span className="text-[#004481] font-medium flex items-center gap-0.5">
                    <span>{isExpanded ? 'Hide details' : 'View line stations'}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isExpanded ? 'expand_less' : 'chevron_right'}
                    </span>
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-2 border-t border-[#f1ecf2] text-xs flex flex-col gap-1 text-[#414751] animate-in fade-in duration-150">
                    <div className="font-semibold text-[#1c1b1f]">Key Interchanges:</div>
                    <p className="text-[11px] text-[#727783]">
                      {line.keyInterchanges?.join(', ') ||
                        'Jurong East, Bishan, City Hall, Raffles Place, Dhoby Ghaut, Marina Bay.'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#006e2a]" />
                      <span className="text-[11px]">All platform screen doors operating normally.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bus Arrival Radar */}
      {selectedSubTab === 'bus' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#c1c6d3] flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="material-symbols-outlined text-[#727783]">directions_bus</span>
              <span className="text-sm font-bold text-[#1c1b1f]">Bus Stop Code:</span>
              <input
                type="text"
                value={busStopCode}
                onChange={(e) => setBusStopCode(e.target.value)}
                placeholder="e.g. 04111, 52081"
                className="border border-[#c1c6d3] rounded-lg px-3 py-1 text-sm outline-none focus:border-[#004481] w-28 font-mono"
              />
              <div className="flex gap-1">
                {['04111', '52081'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setBusStopCode(code)}
                    className={`text-[11px] px-2 py-0.5 rounded font-mono cursor-pointer ${
                      busStopCode === code
                        ? 'bg-[#004481] text-white font-bold'
                        : 'bg-[#f1ecf2] text-[#414751] hover:bg-[#e5e1e7]'
                    }`}
                  >
                    #{code}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#727783] w-full sm:w-auto text-right">
              Showing arrivals for{' '}
              <strong className="text-[#1c1b1f]">
                {busStopNames[busStopCode] || `Stop ${busStopCode}`}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentBusArrivals.map((bus) => (
              <div
                key={bus.service}
                className="bg-white border border-[#c1c6d3] rounded-xl p-4 flex justify-between items-center shadow-xs hover:border-[#727783] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#83fc94] text-[#00752d] border border-[#006e2a] rounded-lg font-bold font-mono text-lg flex items-center justify-center shrink-0">
                    {bus.service}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1c1b1f]">{bus.destination}</h4>
                    <span className="text-xs text-[#727783]">
                      {bus.type} • {bus.crowd}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="bg-[#005baa] text-white text-xs font-bold px-2.5 py-1 rounded-md font-mono">
                    {bus.nextBus}
                  </div>
                  <span className="text-[11px] text-[#727783] font-mono">
                    Next: {bus.nextNextBus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
