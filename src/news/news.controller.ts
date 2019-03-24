import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NewsService } from './news.service';
import { Article } from '../shared/models/article/article.model';
import { NewsSource } from '../shared/models/api/news/news-source.model';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}
  /**
   * Get all by feedType
   */
  @Get()
  findAllByFeedType(): Observable<Article[]> {
    return this.newsService.findAll();
  }

  @Get('sources')
  findAllNewsSources(): NewsSource[] {
    return this.newsService.findAllNewsSources();
  }

  /**
   * Get news by source
   * @param sourceId
   */
  @Get('sources/:sourceId')
  findAllBySource(@Param('sourceId') sourceId: string): Observable<Article[]> {
    return this.newsService.findAll(sourceId);
  }
}
