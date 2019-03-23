import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeedService } from './feed.service';
import { Article } from '../shared/models/article/article.model';

@Controller('feeds')
export class FeedsController {
  constructor(private feedService: FeedService) {}

  /**
   * Get all by feedType
   */
  @Get(':feedType')
  findAllByFeedType(
    @Param('feedType') feedType: string,
  ): Observable<Article[]> {
    return this.feedService.findAll(feedType);
  }

  /**
   * Get news by source
   * @param sourceId
   */
  @Get('sources/:sourceId')
  findAllBySource(@Param('sourceId') sourceId: string): Observable<Article[]> {
    return this.feedService.findAll(sourceId);
  }
}
