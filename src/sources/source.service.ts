import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { ApiSource } from '../shared/models/api/api-source.model';
import { ObjectHelper } from '../shared/helpers/object.helper';

@Injectable()
export class SourceService {
  constructor(private configService: ConfigService) {}

  /**
   * Retrieves all sources
   */
  findAllSources(): ApiSource[] {
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
  findSourcesByFeedType(feedType: string): ApiSource {
    const feeds = this.configService.get('api').feeds;
    return ObjectHelper.hasPath(feeds, feedType)
      ? feeds[feedType].sources
      : null;
  }
}
