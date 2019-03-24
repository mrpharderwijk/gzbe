import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EmergenciesService } from './emergencies.service';
import { Article } from '../shared/models/article/article.model';
import { EmergenciesRegion } from '../shared/models/api/emergencies/emergencies-region.model';

@Controller('emergencies')
export class EmergenciesController {
  constructor(private emergenciesService: EmergenciesService) {}

  @Get('regions')
  findAllRegions(): EmergenciesRegion[] {
    return this.emergenciesService.findAllRegions();
  }
  /**
   * Get emergencies by region
   * @param regionId
   */
  @Get('regions/:regionId')
  findAllByRegion(@Param('regionId') regionId: string): Observable<Article[]> {
    return this.emergenciesService.findAllByRegion(regionId);
  }
}
