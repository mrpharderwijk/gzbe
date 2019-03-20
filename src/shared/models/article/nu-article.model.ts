import { Enclosure } from './enclosure.model';

export interface NuArticle {
  categories?: string[];
  content?: string;
  creator?: string;
  description?: string;
  enclosure?: Enclosure;
  isoDate?: string;
  link?: string;
  rights?: string;
  title?: string;
}
