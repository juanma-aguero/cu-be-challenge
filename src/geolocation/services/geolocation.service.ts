import { Injectable } from '@nestjs/common';
import { LocationDto } from '../dto/location.dto';
import axios from 'axios';

@Injectable()
export class GeolocationService {
  /**
   * locate an ip
   * @param ip
   */
  async locate(ip: string): Promise<LocationDto> {
    const response = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,lat,lon,currency`,
    );

    const location = new LocationDto();
    location.query = ip;
    location.country = response.data.country;
    location.countryCode = response.data.countryCode;
    location.lat = response.data.lat;
    location.lon = response.data.lon;
    location.currency = response.data.currency;

    return location;
  }

  async getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2): Promise<number> {
    return new Promise((resolve) => {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km

      resolve(d);
    });
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
