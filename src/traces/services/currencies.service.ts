import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../entities/currency.entity';
import { Country } from '../entities/country.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async save(currency: Currency) {
    return this.currencyRepository.save(currency);
  }

  async findByCountry(country: Country) {
    return this.currencyRepository.find({
      relations: { country: true },
      where: { country: { id: country.id } },
    });
  }

  /**
   * Get the currency rate to convert from -> to.
   * This uses an external service to get the rate.
   *
   * @param from
   * @param to
   */
  async getRate(from: string, to: string): Promise<number> {
    const fixerApiKey = 'sTSNhWztzcKTTMTtHqinv55DWBQh8rFY';
    let rate = -1;
    try {
      const response = await axios.get(
        `https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=1`,
        {
          headers: {
            'Accept-Encoding': 'application/json',
            apikey: fixerApiKey,
          },
        },
      );

      if (response.status == 200) {
        rate = response.data.result;
      }
    } catch (error) {
      console.error('>>>> convert error:', error);
    }

    return rate;
  }
}
