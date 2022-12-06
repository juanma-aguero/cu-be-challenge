import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Trace } from './entities/trace.entity';
import { TracesController } from './controllers/traces.controller';
import { GeolocationModule } from '../geolocation/geolocation.module';
import { TracesService } from './services/traces.service';
import { CountriesService } from './services/countries.service';
import { CurrenciesService } from './services/currencies.service';
import { Currency } from './entities/currency.entity';
import { StatisticsService } from './services/statistics.service';
import { StatisticsController } from './controllers/statistics.controller';
import { TracesResolver } from './resolvers/traces.resolver';
import { StatisticsResolver } from './resolvers/statistics.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Trace, Currency]),
    GeolocationModule,
  ],
  controllers: [TracesController, StatisticsController],
  providers: [
    TracesService,
    CountriesService,
    CurrenciesService,
    StatisticsService,
    TracesResolver,
    StatisticsResolver,
  ],
})
export class TracesModule {}
