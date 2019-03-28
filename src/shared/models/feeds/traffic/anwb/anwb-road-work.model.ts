import { AnwbTrafficJam } from './anwb-traffic-jam.model';

export interface AnwbRoadWork extends AnwbTrafficJam {
  stop: string;
  stopDate: string;
}
