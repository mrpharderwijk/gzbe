import { TrafficJamsEntry } from './traffic-jams-entry.model';

export interface TrafficRoadWorksEvent {
  total: number;
  roadEntries: TrafficJamsEntry[];
}
