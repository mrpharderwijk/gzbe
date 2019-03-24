import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { ObjectHelper } from '../shared/helpers/object.helper';
import { Observable, forkJoin, from, of, EMPTY } from 'rxjs';
import { Article } from '../shared/models/article/article.model';
import { NewsFeed } from '../shared/models/api/news/news-feed.model';
import { map, catchError } from 'rxjs/operators';
import { FeedHelper } from '../shared/helpers/feed.helper';
import { NewsSource } from '../shared/models/api/news/news-source.model';

import * as Parser from 'rss-parser';

@Injectable()
export class NewsService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  /**
   * Retrieves all general news headlines from all news sources
   * @param categoryName
   */
  findAll(sourceId: string = 'all'): Observable<Article[]> {
    const api = this.configService.get('api');

    if (!ObjectHelper.hasPath(api, `feeds.news.sources`)) {
      return;
    }

    let observableStream = of([]);

    /**
     * Create observableStream with all sources
     */
    const newsSource = api.feeds.news.sources.find(
      (source: NewsSource) => source.id === sourceId,
    );

    if (!newsSource || sourceId === 'all') {
      observableStream = api.feeds.news.sources.map((source: NewsSource) => {
        return this.retrieveArticles(api.feeds.news, source.id);
      });
    }

    /**
     * Create observableStream with only the found source
     * TODO: handle bad requests
     */
    if (newsSource && sourceId !== 'all') {
      observableStream = this.retrieveArticles(api.feeds.news, newsSource.id);
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
    newsFeed: NewsFeed,
    id: string,
    category: string = 'general',
  ): Observable<Article[]> {
    const apiSource = newsFeed.sources.find(
      (source: NewsSource) => source.id === id,
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

  /**
   * Retrieves all news sources
   */
  findAllNewsSources(): NewsSource[] {
    return this.configService.get('api').feeds.news.sources;
  }
}
