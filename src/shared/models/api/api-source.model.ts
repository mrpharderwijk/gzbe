import { ServiceUrl } from './service-url.model';

export interface ApiSource {
  id: string;
  link: string;
  logo: string;
  name: string;
  serviceUrls: ServiceUrl;
}
