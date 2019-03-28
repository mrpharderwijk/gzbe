import { NewsFeed } from '../news/news-feed.model';

export interface TrafficFeed {
  id: string;
  link: string;
  logo: string;
  name: string;
  serviceUrls: {
    url: string;
  };
}
