import { AnwbEventEntry } from './anwb-event-entry.model';
import { AnwbLatLong } from './anwb-lat-long.model';

export interface AnwbTrafficJam {
  msgNr: string;
  from: string;
  fromLoc: AnwbLatLong;
  to: string;
  toLoc: AnwbLatLong;
  location: string;
  segStart: string;
  segEnd: string;
  start: string;
  startDate: string;
  delay: number;
  distance: number;
  reason: string;
  description: string;
  events: AnwbEventEntry[];
}
