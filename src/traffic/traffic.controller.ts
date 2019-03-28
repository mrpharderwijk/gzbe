import { Controller, Get } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller('traffic')
export class TrafficController {
  constructor(private trafficService: TrafficService) {}

  @Get()
  async findAllTraffic() {
    return await this.trafficService.findAllTraffic();
  }

  @Get('speed')
  findAllTrafficSpeed() {
    return this.trafficService.getGzipXml();
  }
}
