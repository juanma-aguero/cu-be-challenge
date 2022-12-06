import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { GeolocationService } from '../../geolocation/services/geolocation.service';
import { LocationDto } from '../../geolocation/dto/location.dto';
import { CurrenciesService } from './currencies.service';
import { Currency } from '../entities/currency.entity';
import currencyMap from '../utils/currencyMap';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    private geolocationService: GeolocationService,
    private currenciesService: CurrenciesService,
  ) {}

  async findByCode(code: string): Promise<Country> {
    return this.countryRepository.findOne({
      where: { code },
      relations: {
        currencies: true,
      },
    });
  }

  async getByLocation(location: LocationDto): Promise<Country> {
    const usaLat = 25.79097;
    const usaLon = -80.21315;

    let country = await this.findByCode(location.countryCode);
    if (!country) {
      country = new Country();
      country.code = location.countryCode;
      country.name = location.country;
      country.distanceToUsa =
        await this.geolocationService.getDistanceFromLatLonInKm(
          usaLat,
          usaLon,
          location.lat,
          location.lon,
        );

      await this.countryRepository.save(country);

      const newRate = await this.currenciesService.getRate(
        location.currency,
        'USD',
      );
      const nationalCurrency = new Currency();
      nationalCurrency.code = location.currency;
      nationalCurrency.symbol = currencyMap[nationalCurrency.code];
      nationalCurrency.rateToUsd = newRate;
      nationalCurrency.rateUpdatedOn = new Date();
      nationalCurrency.country = country;
      await this.currenciesService.save(nationalCurrency);

      country.currencies = [];
      country.currencies.push(nationalCurrency);
      country.rateUpdatedOn = new Date();

      await this.countryRepository.save(country);
    }

    return country;
  }

  async updateRates(country: Country) {
    const currencies = await this.currenciesService.findByCountry(country);
    for (const currency of currencies) {
      currency.rateToUsd = await this.currenciesService.getRate(
        currency.code,
        'USD',
      );
      await this.currenciesService.save(currency);
    }

    country.rateUpdatedOn = new Date();

    await this.countryRepository.save(country);
  }

  async getFarthestCountry(): Promise<Country> | null {
    const countries = await this.countryRepository.find({
      order: { distanceToUsa: 'DESC' },
      take: 1,
    });

    if (countries.length > 0) {
      return countries[0];
    }

    return null;
  }


}
