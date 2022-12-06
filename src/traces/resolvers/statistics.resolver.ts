import { Query, Resolver } from '@nestjs/graphql';
import { StatisticsService } from '../services/statistics.service';
import { StatsOutputDto } from '../dto/statsOutput.dto';

@Resolver()
export class StatisticsResolver {
  constructor(private statsService: StatisticsService) {}

  @Query(() => StatsOutputDto)
  globalStats(): Promise<StatsOutputDto> {
    return this.statsService.findAll();
  }
}
