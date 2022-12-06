import { Injectable } from '@nestjs/common';
import { Trace } from '../entities/trace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeolocationService } from '../../geolocation/services/geolocation.service';
import { CountriesService } from './countries.service';
import { StatsCountryDto } from '../dto/statsCountry.dto';

@Injectable()
export class TracesService {
  constructor(
    @InjectRepository(Trace)
    private tracesRepository: Repository<Trace>,
    private geolocationService: GeolocationService,
    private countriesService: CountriesService,
  ) {}

  findByIp(ip: string): Promise<Trace> {
    return this.tracesRepository.findOne({
      where: {
        ip,
      },
      relations: {
        country: true,
      },
    });
  }

  /**
   * Trace an IP and return its values
   * @param ip
   */
  async traceIp(ip: string): Promise<Trace> {
    let tracedIp = await this.findByIp(ip);

    if (!tracedIp) {
      tracedIp = new Trace();
      tracedIp.count = 1;
      tracedIp.ip = ip;

      // Gather ip info
      const locationData = await this.geolocationService.locate(ip);

      tracedIp.lat = locationData.lat;
      tracedIp.lon = locationData.lon;

      // Process country
      tracedIp.country = await this.countriesService.getByLocation(
        locationData,
      );
    } else {
      tracedIp.count = tracedIp.count + 1;
    }

    // Update currencies rates if needed
    const minutesRatesRetention = 1;
    const today = new Date();
    const diffBetweenRates = Math.round(
      (today.getTime() - tracedIp.country.rateUpdatedOn.getTime()) / 60000,
    );

    if (diffBetweenRates > minutesRatesRetention) {
      await this.countriesService.updateRates(tracedIp.country);
    }
    await this.tracesRepository.save(tracedIp);

    return tracedIp;
  }

  async getMostTracedCountry(): Promise<StatsCountryDto> {
    const qb = this.tracesRepository.createQueryBuilder('t');
    qb.select('c.name, SUM(t.count) as traces');
    qb.innerJoin('t.country', 'c');
    qb.addGroupBy('c.name');
    qb.addOrderBy('traces', 'DESC');

    const countryStats = await qb.getRawOne();

    if (countryStats) {
      return {
        traces: countryStats.traces,
        name: countryStats.name,
      };
    }
    return null;
  }
}
