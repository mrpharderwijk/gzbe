import { Controller, Get, Param } from '@nestjs/common';
import { SourceService } from './source.service';
import { Observable } from 'rxjs';
import { Article } from '../shared/models/article/article.model';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourceService: SourceService) {}

  /**
   * Get all news sources
   */
  @Get()
  findAllSources(): any[] {
    return this.sourceService.findAllSources();
  }

  /**
   * Get all news articles
   */
  @Get('headlines')
  findAllHeadlines(): Observable<Article[]> {
    return this.sourceService.findAllHeadlines();
  }

  @Get(':sourceId/headlines')
  findAllHeadlinesBySource(
    @Param('sourceId') sourceId: string,
  ): Observable<Article[]> {
    return this.sourceService.findAllHeadlines(sourceId);
  }
}
