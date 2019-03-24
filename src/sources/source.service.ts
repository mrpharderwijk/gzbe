import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { NewsSource } from '../shared/models/api/news/news-source.model';
import { ObjectHelper } from '../shared/helpers/object.helper';
import { EmergenciesRegion } from '../shared/models/api/emergencies/emergencies-region.model';

@Injectable()
export class SourceService {
  constructor(private configService: ConfigService) {}

  /**
   * Retrieves all sources
   */
  findAllSources(): NewsSource[] | EmergenciesRegion[] {
    const feeds = this.configService.get('api').feeds;
    return Object.keys(feeds)
      .map(feedType => feeds[feedType].sources)
      .reduce((accSources, feedSources) => {
        return accSources.concat(feedSources);
      }, []);
  }

  /**
   * Retrieve source by ID
   */
  findSourcesByFeedType(feedType: string): NewsSource | EmergenciesRegion {
    console.log(feedType);
    if (!feedType) {
      return;
    }

    const feeds = this.configService.get('api').feeds;

    switch (feedType) {
      case 'news':
        return ObjectHelper.hasPath(feeds, feedType)
          ? feeds[feedType].sources
          : null;

      case 'emergencies':
        return ObjectHelper.hasPath(
          feeds,
          `${feedType}.sources[0].serviceUrls.regions`,
        )
          ? feeds[feedType].sources[0].serviceUrls.regions
          : null;
    }
  }
}
