import { ArticleImage } from './article-image.model';
import { ApiSource } from '../api/api-source.model';

export interface Article {
  source: {
    id: string;
    name: string;
    logo: string;
  };
  author: string;
  categories: string[] | any;
  content: string;
  contentSnippet: string;
  image: ArticleImage;
  isoDate: string;
  link: string;
  title: string;
}
