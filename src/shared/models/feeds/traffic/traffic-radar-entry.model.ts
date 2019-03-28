import { AnwbRoadEntry } from './anwb/anwb-road-entry.model';
import { AnwbRadar } from './anwb/anwb-radar.model';

export interface TrafficRadarEntry {
  road: string;
  roadType: string;
  radars: AnwbRadar[];
}
