import { AnwbTrafficJam } from './anwb-traffic-jam.model';
import { AnwbRoadWork } from './anwb-road-work.model';

export interface AnwbRoadEntry {
  road: string;
  roadType: string;
  events: {
    trafficJams: AnwbTrafficJam[];
    roadWorks: AnwbRoadWork[];
    radars: [];
  };
}
