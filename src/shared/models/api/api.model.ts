import { ApiSource } from './api-source.model';

export interface Api {
  version: string;
  sources: ApiSource[];
}
