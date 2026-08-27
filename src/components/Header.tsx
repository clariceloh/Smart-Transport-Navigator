import React from 'react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAccount: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAccount,
  onOpenSettings,
  onOpenHelp,
  unreadAlertsCount
}) => {
  return (
    <header className="hidden md:flex flex-col bg-white border-b border-[#c1c6d3] w-full top docked shrink-0 z-30 shadow-xs">
      <div className="flex justify-between items-center w-full px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <div
            onClick={() => onTabChange('plan')}
            className="cursor-pointer group py-1"
            id="nav-logo"
          >
            <BrandLogo size="md" />
          </div>

          <nav className="flex gap-6 h-16 items-center">
            <button
              onClick={() => onTabChange('plan')}
              id="tab-plan"
              className={`h-full flex items-center px-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === 'plan'
                  ? 'text-[#004481] border-[#004481]'
                  : 'text-[#414751] hover:text-[#1c1b1f] border-transparent hover:border-[#c1c6d3]'
              }`}
            >
              Plan
            </button>
            <button
              onClick={() => onTabChange('live_status')}
              id="tab-live-status"
              className={`h-full flex items-center px-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === 'live_status'
                  ? 'text-[#004481] border-[#004481]'
                  : 'text-[#414751] hover:text-[#1c1b1f] border-transparent hover:border-[#c1c6d3]'
              }`}
            >
              Live Status
            </button>
            <button
              onClick={() => onTabChange('saved')}
              id="tab-saved"
              className={`h-full flex items-center px-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === 'saved'
                  ? 'text-[#004481] border-[#004481]'
                  : 'text-[#414751] hover:text-[#1c1b1f] border-transparent hover:border-[#c1c6d3]'
              }`}
            >
              Saved
            </button>
            <button
              onClick={() => onTabChange('alerts')}
              id="tab-alerts"
              className={`h-full flex items-center gap-1.5 px-2 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === 'alerts'
                  ? 'text-[#004481] border-[#004481]'
                  : 'text-[#414751] hover:text-[#1c1b1f] border-transparent hover:border-[#c1c6d3]'
              }`}
            >
              <span>Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('alerts')}
            title="Service Notifications"
            id="header-notifications-btn"
            className="text-[#414751] hover:bg-[#f1ecf2] rounded-full p-2 transition-colors flex items-center justify-center relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            title="Preferences & Accessibility"
            id="header-settings-btn"
            className="text-[#414751] hover:bg-[#f1ecf2] rounded-full p-2 transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>

          <button
            onClick={onOpenHelp}
            title="Transit Guide & Fare Calculator"
            id="header-help-btn"
            className="text-[#414751] hover:bg-[#f1ecf2] rounded-full p-2 transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>

          <button
            onClick={onOpenAccount}
            id="header-account-btn"
            className="bg-[#004481] hover:bg-[#005baa] text-white text-[13px] font-medium px-4 py-2 rounded-full transition-colors ml-1 cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
            <span>Account</span>
          </button>
        </div>
      </div>
    </header>
  );
};
