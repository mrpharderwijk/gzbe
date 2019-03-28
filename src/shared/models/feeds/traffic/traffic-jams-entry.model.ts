import { AnwbTrafficJam } from './anwb/anwb-traffic-jam.model';

export interface TrafficJamsEntry {
  road: string;
  roadType: string;
  trafficJams: AnwbTrafficJam[];
}
