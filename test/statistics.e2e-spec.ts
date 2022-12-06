import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Statistics (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get basic stats - Ok (POST)', async () => {
    const response = await request(app.getHttpServer()).get('/statistics');
    expect(response.body.longest_distance.country).toBe('Argentina');
    expect(parseFloat(response.body.most_traced.value)).toBeGreaterThan(
      parseFloat('1'),
    );
    expect(response.body.most_traced.country).toBe('Canada');
  });

  afterAll(async () => {
    await app.close();
  });
});
