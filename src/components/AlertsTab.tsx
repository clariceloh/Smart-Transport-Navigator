import React, { useState } from 'react';
import { TransitAlert } from '../types';

interface AlertsTabProps {
  alerts: TransitAlert[];
}

export const AlertsTab: React.FC<AlertsTabProps> = ({ alerts }) => {
  const [filterType, setFilterType] = useState<'all' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border border-[#c1c6d3] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#1c1b1f]">
              Official Transit Advisories & Alerts
            </h2>
            <span className="px-2 py-0.5 bg-[#83fc94]/30 text-[#006e2a] text-[10px] font-bold rounded-full font-mono uppercase">
              Live OCC Feed
            </span>
          </div>
          <p className="text-sm text-[#414751] mt-1">
            Real-time notifications issued by Land Transport Authority (LTA) and SMRT Operations Control Centre.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#004481] text-white'
                : 'bg-[#f1ecf2] text-[#414751] hover:bg-[#e5e1e7]'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'warning'
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab]'
            }`}
          >
            Warnings ({alerts.filter((a) => a.type === 'warning').length})
          </button>
          <button
            onClick={() => setFilterType('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'info'
                ? 'bg-[#004481] text-white'
                : 'bg-[#f1ecf2] text-[#414751] hover:bg-[#e5e1e7]'
            }`}
          >
            Advisories ({alerts.filter((a) => a.type === 'info').length})
          </button>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="flex flex-col gap-4">
        {filteredAlerts.map((alert) => {
          const isWarning = alert.type === 'warning';

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-5 border shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                isWarning ? 'border-[#ffb4ab] bg-[#fff8f7]' : 'border-[#c1c6d3]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                    isWarning ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#d5e3ff] text-[#004481]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isWarning ? 'warning' : 'info'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                        isWarning ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#e5e1e7] text-[#414751]'
                      }`}
                    >
                      {alert.affectedLine}
                    </span>
                    <span className="text-xs font-mono text-[#727783]">• {alert.timestamp}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#1c1b1f]">{alert.title}</h3>
                  <p className="text-xs text-[#414751] max-w-3xl leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {alert.bridgingBus && (
                  <span className="px-2.5 py-1 bg-[#83fc94]/40 text-[#00752d] text-xs font-bold rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">directions_bus</span>
                    Free Bridging Bus Active
                  </span>
                )}
                <span className="text-xs font-semibold text-[#004481] bg-[#f1ecf2] px-3 py-1.5 rounded-lg font-mono">
                  Verified OCC
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency & Support Card */}
      <div className="bg-[#f7f2f8] border border-[#c1c6d3] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#004481] text-[32px]">support_agent</span>
          <div>
            <h4 className="font-bold text-sm text-[#1c1b1f]">Land Transport Authority 24/7 Hotline</h4>
            <p className="text-xs text-[#414751]">
              For station emergencies, lost property, or train breakdown updates, dial toll-free 1800-CALL-LTA (1800-2255-582).
            </p>
          </div>
        </div>
        <a
          href="tel:18002255582"
          className="bg-white border border-[#c1c6d3] text-[#004481] hover:bg-[#004481] hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0"
        >
          Call 1800-2255-582
        </a>
      </div>
    </div>
  );
};
