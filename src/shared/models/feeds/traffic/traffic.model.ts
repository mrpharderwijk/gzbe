import { TrafficRadarEvent } from './traffic-radar-event.model';
import { TrafficJamsEvent } from './traffic-jams-event.model';
import { TrafficRoadWorksEvent } from './traffic-road-works-event.model';

export interface Traffic {
  radars: TrafficRadarEvent;
  trafficJams: TrafficJamsEvent;
  roadWorks: TrafficRoadWorksEvent;
}
