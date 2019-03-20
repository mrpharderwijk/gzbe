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

  @Get('headlines/:category')
  findAllHeadlinesByCategory(
    @Param('category') cat: string,
  ): Observable<Article[]> {
    return this.sourceService.findAllHeadlines(cat);
  }

  // @Get(':id/headlines')
  // findHeadlinesBySource(@Param() params: { id: string }): Observable<any> {
  //   return this.sourceService.findHeadlinesBySource(params.id);
  // }
}
