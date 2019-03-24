import { EmergenciesRegion } from './emergencies-region.model';

export interface EmergenciesServiceUrls {
  type: string;
  url: string;
  regions: EmergenciesRegion[];
}
