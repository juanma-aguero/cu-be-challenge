import { Controller, Get } from '@nestjs/common';
import { StatsOutputDto } from '../dto/statsOutput.dto';
import { StatisticsService } from '../services/statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private statsService: StatisticsService) {}

  @Get()
  findAll(): Promise<StatsOutputDto> {
    return this.statsService.findAll();
  }
}
