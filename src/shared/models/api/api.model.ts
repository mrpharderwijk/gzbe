import { NewsFeed } from './news/news-feed.model';
import { EmergenciesFeed } from './emergencies/emergencies-feed.model';
import { TrafficFeed } from './traffic/traffic-feed.model';

export interface Api {
  version: string;
  feeds: {
    emergencies: EmergenciesFeed;
    news: NewsFeed;
    traffic: TrafficFeed;
  };
}
