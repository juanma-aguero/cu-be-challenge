import { Injectable } from '@nestjs/common';
import { StatsOutputDto } from '../dto/statsOutput.dto';
import { CountriesService } from './countries.service';
import { TracesService } from './traces.service';

@Injectable()
export class StatisticsService {
  constructor(
    private countriesService: CountriesService,
    private tracesService: TracesService,
  ) {}

  async findAll(): Promise<StatsOutputDto> {
    const farthestCountry = await this.countriesService.getFarthestCountry();
    const mostTracedCountry = await this.tracesService.getMostTracedCountry();

    const newResponse = new StatsOutputDto();
    if (farthestCountry) {
      newResponse.longest_distance = {
        country: farthestCountry.name,
        value: farthestCountry.distanceToUsa,
      };
    }

    if (mostTracedCountry) {
      newResponse.most_traced = {
        country: mostTracedCountry.name,
        value: mostTracedCountry.traces,
      };
    }

    return newResponse;
  }
}
