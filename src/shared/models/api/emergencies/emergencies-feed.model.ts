import { EmergenciesServiceUrls } from './emergencies-service-urls.model';

export interface EmergenciesFeed {
  id: string;
  link: string;
  logo: string;
  name: string;
  serviceUrls: EmergenciesServiceUrls;
}
