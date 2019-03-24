import { Controller, Get, Param } from '@nestjs/common';
import { SourceService } from './source.service';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourceService: SourceService) {}

  /**
   * Get all sources
   */
  @Get()
  findAllSources(): any[] {
    return this.sourceService.findAllSources();
  }

  /**
   * Get sources by feed type
   * @param feedType
   */
  @Get(':feedType')
  findSourcesByFeedType(@Param('feedType') feedType: string) {
    return this.sourceService.findSourcesByFeedType(feedType);
  }
}
