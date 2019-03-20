import { ArticleImage } from './article-image.model';
import { ApiSource } from '../api/api-source.model';

export interface Article {
  source: {
    id: string;
    name: string;
  };
  author: string;
  categories: string[] | any;
  description: string;
  image: ArticleImage;
  isoDate: string;
  link: string;
  title: string;
}
