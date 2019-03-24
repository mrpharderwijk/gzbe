import { NewsServiceUrls } from './news-service-urls.model';

export interface NewsSource {
  id: string;
  link: string;
  logo: string;
  name: string;
  serviceUrls: NewsServiceUrls;
}
