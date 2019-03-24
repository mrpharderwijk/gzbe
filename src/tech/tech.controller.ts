import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TechService } from './tech.service';
import { Article } from '../shared/models/article/article.model';
import { NewsSource } from '../shared/models/api/news/news-source.model';

@Controller('tech')
export class TechController {
  constructor(private techService: TechService) {}
  /**
   * Get all by feedType
   */
  @Get()
  findAllTech(): Observable<Article[]> {
    return this.techService.findAll();
  }

  @Get('sources')
  findAllTechSources(): NewsSource[] {
    return this.techService.findAllTechSources();
  }

  /**
   * Get news by source
   * @param sourceId
   */
  @Get('sources/:sourceId')
  findAllBySource(@Param('sourceId') sourceId: string): Observable<Article[]> {
    return this.techService.findAll(sourceId);
  }
}
