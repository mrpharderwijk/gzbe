import { AnwbRoadWork } from './anwb/anwb-road-work.model';

export interface TrafficRoadWorksEntry {
  road: string;
  roadType: string;
  roadWorks: AnwbRoadWork[];
}
