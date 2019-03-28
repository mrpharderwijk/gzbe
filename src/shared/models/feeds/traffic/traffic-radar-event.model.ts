import { TrafficRadarEntry } from './traffic-radar-entry.model';

export interface TrafficRadarEvent {
  total: number;
  roadEntries: TrafficRadarEntry[];
}
