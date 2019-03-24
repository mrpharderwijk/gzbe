import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { Observable, of, forkJoin, from } from 'rxjs';
import { ObjectHelper } from '../shared/helpers/object.helper';
import { EmergenciesFeed } from '../shared/models/api/emergencies/emergencies-feed.model';
import { EmergenciesRegion } from '../shared/models/api/emergencies/emergencies-region.model';
import { FeedHelper } from '../shared/helpers/feed.helper';
import { map } from 'rxjs/operators';

import * as Parser from 'rss-parser';

@Injectable()
export class EmergenciesService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  /**
   * Retrieves all general news headlines from all news sources
   * @param categoryName
   */
  findAllByRegion(regionId: string): Observable<any[]> {
    const api = this.configService.get('api');

    if (!ObjectHelper.hasPath(api, `feeds.emergencies`) || !regionId) {
      return;
    }

    let observableStream = of([]);
    /**
     * Create observableStream with only the found source
     * TODO: handle bad requests
     */
    observableStream = this.retrieveEmergencies(
      api.feeds.emergencies,
      regionId,
    );

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
  private retrieveEmergencies(
    emergenciesFeed: EmergenciesFeed,
    regionId: string,
  ): Observable<any[]> {
    const foundRegion = emergenciesFeed.serviceUrls.regions.find(
      (region: EmergenciesRegion) => region.id === regionId,
    );

    if (!foundRegion) {
      return of([]);
    }

    const url = `${emergenciesFeed.serviceUrls.url}/${foundRegion.id}.rss`;
    const parser = new Parser();
    const feed = parser.parseURL(url);

    // Transform feed promise to observable and map the articles to GZ article model
    return from(feed).pipe(
      map(feedResponse => {
        return FeedHelper.alarmeringenMapper(
          emergenciesFeed,
          feedResponse.items,
        );
      }),
    );
  }

  findAllRegions() {
    return this.configService.get('api').feeds.emergencies.serviceUrls.regions;
  }
}
