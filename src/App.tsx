import React, { useState } from 'react';
import { DisruptionTicker } from './components/DisruptionTicker';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { RoutePlannerSidebar } from './components/RoutePlannerSidebar';
import { RouteResults } from './components/RouteResults';
import { RouteModal } from './components/RouteModal';
import { LiveStatusTab } from './components/LiveStatusTab';
import { SavedRoutesTab } from './components/SavedRoutesTab';
import { AlertsTab } from './components/AlertsTab';
import { Modals } from './components/Modals';
import { BrandLogo } from './components/BrandLogo';
import {
  INITIAL_ROUTES,
  SAVED_ROUTES,
  TRANSIT_ALERTS
} from './data/transitData';
import {
  TransitRoute,
  SavedRoute,
  TransitAlert,
  IncidentAlert,
  TransportMode,
  ScheduleType,
  SortOption
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('plan');
  const [origin, setOrigin] = useState<string>('Toa Payoh Central');
  const [destination, setDestination] = useState<string>('Changi Airport T3');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('depart');
  const [dateString, setDateString] = useState<string>('Today');
  const [timeString, setTimeString] = useState<string>('Now');
  const [transportMode, setTransportMode] = useState<TransportMode>('mixed');
  const [sortBy, setSortBy] = useState<SortOption>('best_match');

  const [routes, setRoutes] = useState<TransitRoute[]>(INITIAL_ROUTES);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>(SAVED_ROUTES);
  const [alerts] = useState<TransitAlert[]>(TRANSIT_ALERTS);

  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [selectedRouteModal, setSelectedRouteModal] = useState<TransitRoute | null>(null);
  const [incidentDetail, setIncidentDetail] = useState<IncidentAlert | null>(null);

  const [showAccount, setShowAccount] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Filter routes according to selected transport mode
  const filteredRoutes = routes.filter((route) => {
    if (transportMode === 'bus_only') {
      return route.segments.every((s) => s.mode === 'bus' || s.mode === 'walk');
    }
    if (transportMode === 'train_only') {
      return route.segments.every((s) => s.mode === 'train' || s.mode === 'walk');
    }
    return true;
  });

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handlePlanRoute = () => {
    setIsPlanning(true);
    setTimeout(() => {
      setIsPlanning(false);
      // Dynamically tweak route cards slightly to reflect custom locations
      setRoutes((prev) =>
        prev.map((r, i) => ({
          ...r,
          id: `route-${Date.now()}-${i}`
        }))
      );
    }, 450);
  };

  const handlePlanSavedRoute = (
    savedOrigin: string,
    savedDest: string,
    mode: TransportMode
  ) => {
    setOrigin(savedOrigin);
    setDestination(savedDest);
    setTransportMode(mode);
    setActiveTab('plan');
    handlePlanRoute();
  };

  const handleDeleteSavedRoute = (id: string) => {
    setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddCustomSave = (newRoute: {
    title: string;
    origin: string;
    destination: string;
    mode: TransportMode;
    duration: string;
    tags: string[];
  }) => {
    const item: SavedRoute = {
      id: `save-${Date.now()}`,
      title: newRoute.title,
      origin: newRoute.origin,
      destination: newRoute.destination,
      preferredMode: newRoute.mode,
      usualDuration: newRoute.duration,
      tags: newRoute.tags
    };
    setSavedRoutes((prev) => [item, ...prev]);
  };

  const handleSaveRoute = (route: TransitRoute) => {
    const isAlreadySaved = savedRoutes.some(
      (r) => r.origin === origin && r.destination === destination
    );
    if (isAlreadySaved) {
      setSavedRoutes((prev) =>
        prev.filter((r) => !(r.origin === origin && r.destination === destination))
      );
    } else {
      const newSaved: SavedRoute = {
        id: `save-${Date.now()}`,
        title: `${origin} → ${destination}`,
        origin,
        destination,
        preferredMode: transportMode,
        usualDuration: `${route.totalDurationMinutes} mins`,
        tags: ['Custom', 'Recent']
      };
      setSavedRoutes((prev) => [newSaved, ...prev]);
    }
  };

  const unreadAlertsCount = alerts.filter((a) => a.type === 'warning').length;

  return (
    <div className="min-h-screen bg-[#fdf8fd] text-[#1c1b1f] flex flex-col font-sans antialiased selection:bg-[#d5e3ff] selection:text-[#004481]">
      {/* 1. Live Disruption & OCC Advisory Ticker */}
      <DisruptionTicker
        onOpenAlertsTab={() => setActiveTab('alerts')}
        onOpenIncidentDetail={(inc) => setIncidentDetail(inc)}
      />

      {/* 2. Desktop Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAccount={() => setShowAccount(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#c1c6d3] sticky top-0 z-30 shadow-xs">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 text-[#414751] hover:bg-[#f1ecf2] rounded-full"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button
            onClick={() => setShowAccount(true)}
            className="p-1.5 text-[#004481] hover:bg-[#f1ecf2] rounded-full"
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
          </button>
        </div>
      </div>

      {/* 3. Main Body Container */}
      <main className="flex-1 flex flex-col md:flex-row pb-20 md:pb-0 overflow-hidden">
        {activeTab === 'plan' && (
          <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1440px] mx-auto overflow-hidden">
            {/* Sidebar Journey Planner */}
            <RoutePlannerSidebar
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onSwapLocations={handleSwapLocations}
              scheduleType={scheduleType}
              onScheduleTypeChange={setScheduleType}
              dateString={dateString}
              timeString={timeString}
              onDateTimeChange={(d, t) => {
                setDateString(d);
                setTimeString(t);
              }}
              transportMode={transportMode}
              onTransportModeChange={setTransportMode}
              onPlanRoute={handlePlanRoute}
              isPlanning={isPlanning}
            />

            {/* Route Results Feed */}
            <RouteResults
              routes={filteredRoutes}
              onSelectRoute={(route) => setSelectedRouteModal(route)}
              origin={origin}
              destination={destination}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        )}

        {activeTab === 'live_status' && <LiveStatusTab />}

        {activeTab === 'saved' && (
          <SavedRoutesTab
            savedRoutes={savedRoutes}
            onPlanSavedRoute={handlePlanSavedRoute}
            onDeleteSavedRoute={handleDeleteSavedRoute}
            onAddCustomSave={handleAddCustomSave}
          />
        )}

        {activeTab === 'alerts' && <AlertsTab alerts={alerts} />}
      </main>

      {/* 4. Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* 5. Route Details Itinerary Modal */}
      {selectedRouteModal && (
        <RouteModal
          route={selectedRouteModal}
          onClose={() => setSelectedRouteModal(null)}
          onSaveRoute={handleSaveRoute}
          isSaved={savedRoutes.some(
            (r) => r.origin === origin && r.destination === destination
          )}
        />
      )}

      {/* 6. Supplementary Modals (Account, Settings, Help, Incident Detail) */}
      <Modals
        showAccount={showAccount}
        showSettings={showSettings}
        showHelp={showHelp}
        onClose={() => {
          setShowAccount(false);
          setShowSettings(false);
          setShowHelp(false);
        }}
        incidentDetail={incidentDetail}
        onCloseIncident={() => setIncidentDetail(null)}
        onOpenAlertsTab={() => {
          setIncidentDetail(null);
          setActiveTab('alerts');
        }}
      />
    </div>
  );
}

export default App;
