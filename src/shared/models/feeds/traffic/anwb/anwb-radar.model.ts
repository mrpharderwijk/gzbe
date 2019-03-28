import { AnwbLatLong } from './anwb-lat-long.model';
import { AnwbTrafficJam } from './anwb-traffic-jam.model';

export interface AnwbRadar extends AnwbTrafficJam {
  loc: AnwbLatLong;
}
