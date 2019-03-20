import { Enclosure } from './enclosure.model';

export interface NosArticle {
  content?: string;
  contentSnippet?: string;
  enclosure?: Enclosure;
  guid?: string;
  isoDate?: string;
  itunes?: {};
  link?: string;
  pubDate?: string;
  title?: string;
}
