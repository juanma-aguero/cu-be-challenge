import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TracesService } from '../services/traces.service';
import { TraceInputDto } from '../dto/traceInputDto';
import { TraceOutputDto } from '../dto/traceOutput.dto';
import { CurrenciesService } from '../services/currencies.service';
import { isIPv4 } from 'net';

@Controller('traces')
export class TracesController {
  constructor(
    private tracesService: TracesService,
    private currenciesService: CurrenciesService,
  ) {}

  @Post()
  async create(@Body() inputDto: TraceInputDto): Promise<TraceOutputDto> {
    // Check that the ip input is an IPv4
    if (!isIPv4(inputDto.ip)) {
      throw new HttpException('IP format not valid', HttpStatus.BAD_REQUEST);
    }

    const trace = await this.tracesService.traceIp(inputDto.ip);
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
