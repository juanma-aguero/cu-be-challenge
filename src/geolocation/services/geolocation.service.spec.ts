import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocationService],
    }).compile();

    service = module.get<GeolocationService>(GeolocationService);
  });

  it('Distance same lat lon is zero - ok', async () => {
    const miamiLatLon = {
      lat: 25.824736,
      lon: -80.260016,
    };
    const distance = await service.getDistanceFromLatLonInKm(
      miamiLatLon.lat,
      miamiLatLon.lon,
      miamiLatLon.lat,
      miamiLatLon.lon,
    );

    expect(distance).toBe(0);
  });

  it('Distance between Miami & BsAs - ok', async () => {
    const miamiLatLon = {
      lat: 25.824736,
      lon: -80.260016,
    };
    const bsAsLatLon = {
      lat: -34.6062,
      lon: -58.37803,
    };
    const distance = await service.getDistanceFromLatLonInKm(
      miamiLatLon.lat,
      miamiLatLon.lon,
      bsAsLatLon.lat,
      bsAsLatLon.lon,
    );

    expect(distance).toBeLessThan(8000);
    expect(distance).toBeGreaterThan(7000);
  });
});
