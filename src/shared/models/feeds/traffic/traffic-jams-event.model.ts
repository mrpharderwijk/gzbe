import { TrafficJamsEntry } from './traffic-jams-entry.model';

export interface TrafficJamsEvent {
  total: number;
  roadEntries: TrafficJamsEntry[];
}
