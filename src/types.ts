export type TransportMode = 'mixed' | 'bus_only' | 'train_only';
export type ScheduleType = 'depart' | 'arrive';
export type SortOption = 'best_match' | 'fastest' | 'least_transfers' | 'least_walking';
export type WeatherType = 'sunny' | 'rain';

export interface StationLocation {
  id: string;
  name: string;
  code: string;
  category: 'station' | 'landmark' | 'airport' | 'preset';
  address: string;
  lines: string[];
}

export interface RouteSegment {
  id: string;
  mode: 'walk' | 'train' | 'bus' | 'destination';
  durationMinutes: number;
  label: string;
  lineCode?: string;
  lineName?: string;
  serviceNumber?: string;
  colorBg?: string;
  colorText?: string;
  colorBorder?: string;
  fromStop: string;
  toStop: string;
  numStops?: number;
  platform?: string;
  headsign?: string;
  intermediateStops?: string[];
  crowdLevel?: 'Low' | 'Moderate' | 'High';
}

export interface DetailedStep {
  time: string;
  instruction: string;
  detail: string;
  mode: 'walk' | 'train' | 'bus' | 'destination';
  badge?: string;
  badgeColor?: string;
  duration: string;
  stopsCount?: number;
  intermediateStops?: string[];
}

export interface TransitRoute {
  id: string;
  totalDurationMinutes: number;
  departureTime: string;
  arrivalTime: string;
  status: 'On Time' | 'Minor Delay' | 'Heavy Delay';
  statusColor: string;
  badge: 'Most Optimal' | 'Direct Bus' | 'Fastest' | string;
  isOptimal: boolean;
  fare: string;
  calories: number;
  carbonSaved: string;
  transportType: TransportMode;
  segments: RouteSegment[];
  detailedSteps: DetailedStep[];
}

export interface MRTLineInfo {
  lineCode: string;
  name: string;
  color: string;
  textColor: string;
  status: 'Normal Service' | 'Minor Delay' | 'Track Maintenance' | 'Disrupted';
  frequency: string;
  lastUpdated: string;
  delayNotice?: string;
  keyInterchanges?: string[];
}

export interface BusArrivalInfo {
  service: string;
  destination: string;
  type: string;
  crowd: 'Seats Available' | 'Standing Available' | 'Limited Standing';
  nextBus: string;
  nextNextBus: string;
  wheelchair: boolean;
}

export interface TransitAlert {
  id: string;
  type: 'warning' | 'info' | 'critical';
  title: string;
  timestamp: string;
  affectedLine: string;
  description: string;
  bridgingBus: boolean;
}

export interface IncidentAlert {
  id: string;
  category: 'traffic' | 'weather' | 'rail';
  severity: 'warning' | 'info' | 'critical';
  title: string;
  detail: string;
  affectedCorridor: string;
  impactBadge: string;
  actionLabel: string;
  time: string;
}

export interface SavedRoute {
  id: string;
  title: string;
  origin: string;
  destination: string;
  preferredMode: TransportMode;
  usualDuration: string;
  notifyTime?: string;
  tags: string[];
}
