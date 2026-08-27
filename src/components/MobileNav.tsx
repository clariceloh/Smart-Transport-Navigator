import React from 'react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadAlertsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#c1c6d3] z-50 flex justify-around py-2 shadow-lg safe-bottom">
      <button
        onClick={() => onTabChange('plan')}
        id="mobile-nav-plan"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer ${
          activeTab === 'plan' ? 'text-[#004481] font-bold' : 'text-[#727783]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{ fontVariationSettings: activeTab === 'plan' ? "'FILL' 1" : "'FILL' 0" }}
        >
          directions_transit
        </span>
        <span className="text-[10px]">Plan</span>
      </button>

      <button
        onClick={() => onTabChange('live_status')}
        id="mobile-nav-live"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer ${
          activeTab === 'live_status' ? 'text-[#004481] font-bold' : 'text-[#727783]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{ fontVariationSettings: activeTab === 'live_status' ? "'FILL' 1" : "'FILL' 0" }}
        >
          radar
        </span>
        <span className="text-[10px]">Live Status</span>
      </button>

      <button
        onClick={() => onTabChange('saved')}
        id="mobile-nav-saved"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer ${
          activeTab === 'saved' ? 'text-[#004481] font-bold' : 'text-[#727783]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{ fontVariationSettings: activeTab === 'saved' ? "'FILL' 1" : "'FILL' 0" }}
        >
          bookmark
        </span>
        <span className="text-[10px]">Saved</span>
      </button>

      <button
        onClick={() => onTabChange('alerts')}
        id="mobile-nav-alerts"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 relative cursor-pointer ${
          activeTab === 'alerts' ? 'text-[#004481] font-bold' : 'text-[#727783]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{ fontVariationSettings: activeTab === 'alerts' ? "'FILL' 1" : "'FILL' 0" }}
        >
          notifications
        </span>
        <span className="text-[10px]">Alerts</span>
        {unreadAlertsCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadAlertsCount}
          </span>
        )}
      </button>
    </nav>
  );
};
