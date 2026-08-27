import React, { useState } from 'react';
import { IncidentAlert } from '../types';

interface ModalsProps {
  showAccount: boolean;
  showSettings: boolean;
  showHelp: boolean;
  onClose: () => void;
  incidentDetail: IncidentAlert | null;
  onCloseIncident: () => void;
  onOpenAlertsTab: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  showAccount,
  showSettings,
  showHelp,
  onClose,
  incidentDetail,
  onCloseIncident,
  onOpenAlertsTab
}) => {
  // Preferences State
  const [walkingSpeed, setWalkingSpeed] = useState('standard');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [shelteredWalkways, setShelteredWalkways] = useState(true);
  const [liveAlerts, setLiveAlerts] = useState(true);

  // Account State
  const [autoTopUp, setAutoTopUp] = useState(true);

  return (
    <>
      {/* Incident Detail Modal */}
      {incidentDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c6d3] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-[#c1c6d3] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-[#ffdad6] text-[#ba1a1a] rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a] font-mono">
                    Disruption & Operations Advisory
                  </span>
                  <h3 className="font-bold text-base text-[#1c1b1f] leading-snug">
                    {incidentDetail.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onCloseIncident}
                className="text-[#727783] hover:text-[#1c1b1f] p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-[#f7f2f8] p-4 rounded-xl border border-[#c1c6d3] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#414751]">
                <span className="font-semibold">Corridor: {incidentDetail.affectedCorridor}</span>
                <span className="font-mono text-[11px]">{incidentDetail.time}</span>
              </div>
              <p className="text-sm text-[#1c1b1f] leading-relaxed">{incidentDetail.detail}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 self-start px-2.5 py-1 bg-[#83fc94]/30 text-[#006e2a] rounded-md text-xs font-bold font-mono">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Impact Status: {incidentDetail.impactBadge}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={onCloseIncident}
                className="px-4 py-2 text-xs font-bold text-[#414751] hover:bg-[#f1ecf2] rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onCloseIncident();
                  onOpenAlertsTab();
                }}
                className="px-4 py-2 text-xs font-bold bg-[#004481] hover:bg-[#005baa] text-white rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Operations Center</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account / SimplyGo Modal */}
      {showAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c1c6d3] shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-[#c1c6d3] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004481] text-[24px]">account_balance_wallet</span>
                <h3 className="font-bold text-lg text-[#1c1b1f]">SimplyGo & EZ-Link Wallet</h3>
              </div>
              <button onClick={onClose} className="text-[#727783] hover:text-[#1c1b1f] cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Virtual Transit Card */}
            <div className="bg-gradient-to-br from-[#004481] via-[#005baa] to-[#00284e] text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between h-44 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
                    Singapore Transit Contactless
                  </span>
                  <h4 className="font-extrabold text-base tracking-wide">SimplyGo Mastercard</h4>
                </div>
                <span className="text-xs px-2 py-0.5 bg-[#83fc94] text-[#00752d] rounded font-mono font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase opacity-70">Card Balance</span>
                <span className="text-3xl font-extrabold font-mono tracking-tight">$34.50</span>
              </div>

              <div className="flex justify-between items-end text-xs font-mono opacity-80">
                <span>•••• 8829</span>
                <span>EXP: 09/28</span>
              </div>
            </div>

            {/* Account Options */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 bg-[#f7f2f8] rounded-xl border border-[#c1c6d3]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006e2a]">autorenew</span>
                  <div>
                    <span className="text-xs font-bold text-[#1c1b1f] block">Auto Top-up ($20)</span>
                    <span className="text-[11px] text-[#727783]">When balance falls below $5.00</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoTopUp}
                  onChange={(e) => setAutoTopUp(e.target.checked)}
                  className="w-4 h-4 rounded text-[#004481] cursor-pointer"
                />
              </div>

              <div className="border-t border-[#f1ecf2] pt-2">
                <div className="text-xs font-bold text-[#727783] uppercase mb-2">Recent Trips</div>
                <div className="flex flex-col gap-2">
                  {[
                    { from: 'Toa Payoh MRT', to: 'Raffles Place', fare: '-$1.48', time: 'Yesterday 08:32 AM' },
                    { from: 'Bus 168 (Bay 2)', to: 'City Hall', fare: '-$1.09', time: '25 Aug 06:14 PM' }
                  ].map((trip, tIdx) => (
                    <div
                      key={tIdx}
                      className="flex items-center justify-between text-xs p-2 bg-[#f1ecf2]/60 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-[#1c1b1f]">
                          {trip.from} → {trip.to}
                        </div>
                        <div className="text-[10px] text-[#727783]">{trip.time}</div>
                      </div>
                      <span className="font-mono font-bold text-[#ba1a1a]">{trip.fare}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#004481] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#005baa] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Settings / Preferences Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c1c6d3] shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-[#c1c6d3] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004481] text-[24px]">tune</span>
                <h3 className="font-bold text-lg text-[#1c1b1f]">Routing & Accessibility</h3>
              </div>
              <button onClick={onClose} className="text-[#727783] hover:text-[#1c1b1f] cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#414751] block mb-1">
                  Walking Speed Calibration
                </label>
                <select
                  value={walkingSpeed}
                  onChange={(e) => setWalkingSpeed(e.target.value)}
                  className="w-full border border-[#c1c6d3] rounded-lg px-3 py-2 text-xs outline-none"
                >
                  <option value="slow">Relaxed / Gentle (3.5 km/h)</option>
                  <option value="standard">Standard Commuter (4.8 km/h)</option>
                  <option value="fast">Brisk / Fast Walking (6.0 km/h)</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-3 bg-[#f7f2f8] rounded-xl border border-[#c1c6d3] cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-[#1c1b1f] block">
                    Wheelchair & Stroller Accessible
                  </span>
                  <span className="text-xs text-[#727783]">
                    Prioritize step-free lifts, ramps, and dual-decker PIW buses
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={wheelchairOnly}
                  onChange={(e) => setWheelchairOnly(e.target.checked)}
                  className="w-5 h-5 rounded text-[#004481] focus:ring-[#004481] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#f7f2f8] rounded-xl border border-[#c1c6d3] cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-[#1c1b1f] block">
                    Sheltered Walkways & Less Walking
                  </span>
                  <span className="text-xs text-[#727783]">
                    Minimize uncovered walking distance during rainy weather
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={shelteredWalkways}
                  onChange={(e) => setShelteredWalkways(e.target.checked)}
                  className="w-5 h-5 rounded text-[#004481] focus:ring-[#004481] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#f7f2f8] rounded-xl border border-[#c1c6d3] cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-[#1c1b1f] block">
                    Live Disruption Push Alerts
                  </span>
                  <span className="text-xs text-[#727783]">
                    Receive instant announcements for your saved commute lines
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={liveAlerts}
                  onChange={(e) => setLiveAlerts(e.target.checked)}
                  className="w-5 h-5 rounded text-[#004481] focus:ring-[#004481] cursor-pointer"
                />
              </label>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#004481] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#005baa] cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Help / Guide Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c1c6d3] shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-[#c1c6d3] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004481] text-[24px]">help_outline</span>
                <h3 className="font-bold text-lg text-[#1c1b1f]">Smart Transport Navigator Guide</h3>
              </div>
              <button onClick={onClose} className="text-[#727783] hover:text-[#1c1b1f] cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="text-xs text-[#414751] flex flex-col gap-3">
              <div className="bg-[#f7f2f8] p-3 rounded-lg border border-[#c1c6d3]">
                <h4 className="font-bold text-[#1c1b1f] mb-1">Fare Structure & Transfer Rules</h4>
                <p className="leading-relaxed">
                  Distance-based fares apply seamlessly between MRT, LRT, and public buses within 45 minutes of transferring. Simply tap the same card or mobile contactless device.
                </p>
              </div>

              <div className="bg-[#f7f2f8] p-3 rounded-lg border border-[#c1c6d3]">
                <h4 className="font-bold text-[#1c1b1f] mb-1">Transport Support & OCC Hotline</h4>
                <p>
                  Smart Transport Support: <strong>1800-336-8900</strong> (7:30 AM - 8:00 PM daily)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#004481] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#005baa] cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
};
