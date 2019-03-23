import { ApiFeed } from './api-feed.model';

export interface Api {
  version: string;
  feeds: ApiFeed;
}
