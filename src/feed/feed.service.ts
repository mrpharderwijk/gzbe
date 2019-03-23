import { Injectable, HttpService } from '@nestjs/common';
import { Observable, of, from, EMPTY, forkJoin } from 'rxjs';
import { ConfigService } from 'nestjs-config';
import { ApiSource } from '../shared/models/api/api-source.model';
import { ObjectHelper } from '../shared/helpers/object.helper';

import * as Parser from 'rss-parser';
import { map, catchError } from 'rxjs/operators';
import { Article } from '../shared/models/article/article.model';
import { FeedHelper } from '../shared/helpers/feed.helper';
import { ApiFeed } from '../shared/models/api/api-feed.model';

@Injectable()
export class FeedService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  /**
   * Retrieves all general news headlines from all news sources
   * @param categoryName
   */
  findAll(type: string, sourceId: string = 'all'): Observable<Article[]> {
    const api = this.configService.get('api');
    if (!ObjectHelper.hasPath(api, `feeds.${type}.sources`)) {
      return;
    }

    let observableStream = of([]);

    // Find the source by id
    const feedType = this.configService.get('api').feeds[type];
    const sourceFound = feedType.sources.find(
      (source: ApiSource) => source.id === sourceId,
    );

    /**
     * Create observableStream with all sources
     */
    if (!sourceFound || sourceId === 'all') {
      observableStream = feedType.sources.map((source: ApiSource) => {
        return this.retrieveArticles(feedType, source.id);
      });
    }

    /**
     * Create observableStream with only the found source
     * TODO: handle bad requests
     */
    if (sourceFound && sourceId !== 'all') {
      observableStream = this.retrieveArticles(feedType, sourceFound.id);
    }

    const response = forkJoin(
      observableStream,
      // this.retrieveArticles('alarmeringen'),
      // merges all the results in one array
      (...results: any[]) =>
        results.reduce((acc, currResponse) => {
          return currResponse ? acc.concat(currResponse) : acc;
        }, []),
    );

    return response;
  }

  /**
   * Retrieves the articles of a given news source by name and category
   * @param name
   * @param category
   */
  private retrieveArticles(
    feedType: ApiFeed,
    id: string,
    category: string = 'general',
  ): Observable<Article[]> {
    const apiSource = feedType.sources.find(
      (source: ApiSource) => source.id === id,
    );
    const type = apiSource.serviceUrls.type;
    const url = ObjectHelper.hasPath(apiSource, `serviceUrls.${category}`)
      ? apiSource.serviceUrls[category]
      : null;

    if (!url) {
      return of([]);
    }

    /**
     * RSS feed calls
     */
    if (type === 'RSS') {
      const parser = new Parser();
      const feed = parser.parseURL(url);

      // Transform feed promise to observable and map the articles to GZ article model
      return from(feed).pipe(
        map(feedResponse => {
          switch (id) {
            case 'nos':
              return FeedHelper.nosMapper(apiSource, feedResponse.items);
            case 'nu-nl':
              return FeedHelper.nuNlMapper(apiSource, feedResponse.items);
            case 'geenstijl':
              return FeedHelper.geenStijlMapper(apiSource, feedResponse.items);
            case 'tweakers':
              return FeedHelper.tweakersMapper(apiSource, feedResponse.items);
            case 'alarmeringen':
              return FeedHelper.alarmeringenMapper(
                apiSource,
                feedResponse.items,
              );
          }
        }),
      );
    }

    /**
     * API calls
     */
    if (type === 'API') {
      return this.httpService.get(url).pipe(
        catchError(error => {
          console.error(error);
          return EMPTY;
        }),
        map(apiResponse => {
          return FeedHelper.rtlNieuwsMapper(
            apiSource,
            apiResponse.data.articles,
          );
        }),
      );
    }
  }
}
