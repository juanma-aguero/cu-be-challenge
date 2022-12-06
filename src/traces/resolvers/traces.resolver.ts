import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Trace } from '../models/trace.model';
import { TraceOutputDto } from '../dto/traceOutput.dto';
import { TracesService } from '../services/traces.service';
import { CurrenciesService } from '../services/currencies.service';
import { TraceInputDto } from '../dto/traceInputDto';
import { isIPv4 } from 'net';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver((of) => Trace)
export class TracesResolver {
  constructor(
    private tracesService: TracesService,
    private currenciesService: CurrenciesService,
  ) {}

  @Mutation(() => TraceOutputDto)
  async trace(@Args('input') input: TraceInputDto): Promise<TraceOutputDto> {
    // Check that the ip input is an IPv4
    if (!isIPv4(input.ip)) {
      throw new HttpException('IP format not valid', HttpStatus.BAD_REQUEST);
    }

    const trace = await this.tracesService.traceIp(input.ip);
    const currencies = await this.currenciesService.findByCountry(
      trace.country,
    );

    return {
      ip: trace.ip,
      name: trace.country.name,
      code: trace.country.code,
      lat: trace.lat,
      lon: trace.lon,
      currencies: currencies.map((currency) => {
        return {
          iso: currency.symbol,
          symbol: currency.code,
          conversion_rate: currency.rateToUsd,
        };
      }),
    };
  }
}
