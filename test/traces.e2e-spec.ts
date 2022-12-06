import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Traces (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Only valid IP format - 400 (POST)', () => {
    const wrongIP = '24.48';
    return request(app.getHttpServer())
      .post('/traces')
      .send({ ip: wrongIP })
      .expect(400);
  });

  it('Trace Argentina IP - Ok (POST)', async () => {
    const argIP = '170.51.107.122';
    const requestTest = request(app.getHttpServer());

    await requestTest
      .post('/traces')
      .send({ ip: argIP })
      .expect(201)
      .expect((data) => {
        return data.body.ip === argIP;
      })
      .expect((data) => {
        return data.body.code === 'AR';
      })
      .expect((data) => {
        return data.body.name == 'Argentina';
      });

    return requestTest;
  });

  it('Trace Canada IP - Ok (POST)', () => {
    const canadaIP = '24.48.0.1';
    return request(app.getHttpServer())
      .post('/traces')
      .send({ ip: canadaIP })
      .expect(201)
      .expect((data) => {
        return data.body.ip === canadaIP;
      })
      .expect((data) => {
        return data.body.code === 'CA';
      })
      .expect((data) => {
        return data.body.name == 'Canada';
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
