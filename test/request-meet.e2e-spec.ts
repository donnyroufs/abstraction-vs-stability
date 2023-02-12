import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RequestMeetRequest } from '../src/features/request-meet/request-meet.request';
import {
  CaregiverEntity,
  CaregiverStatus,
} from '../src/features/request-meet/caregiver.entity';
import { DataSource } from 'typeorm';

describe('RequestMeetController', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = await moduleFixture.get(DataSource);
    await app.init();
  });

  beforeEach(async () => {
    const repo = dataSource.getRepository(CaregiverEntity);
    await repo.query(`TRUNCATE "Caregivers" RESTART IDENTITY CASCADE;`);
  });

  test('throws a bad request when the caregiver does not exist', async () => {
    return request(app.getHttpServer())
      .post('/request-meet')
      .send(new RequestMeetRequest(1, 1))
      .expect(400);
  });

  test('throws a bad request when the caregiver is not available', async () => {
    const caregiver = new CaregiverEntity();
    caregiver.id = 1;
    caregiver.name = 'john';
    caregiver.status = CaregiverStatus.NotAvailable;
    await caregiver.save();

    return request(app.getHttpServer())
      .post('/request-meet')
      .send(new RequestMeetRequest(1, 1))
      .expect(400);
  });

  test('returns the id for the created request', async () => {
    const caregiver = new CaregiverEntity();
    caregiver.id = 1;
    caregiver.name = 'john';
    caregiver.status = CaregiverStatus.Available;
    await caregiver.save();

    return request(app.getHttpServer())
      .post('/request-meet')
      .send(new RequestMeetRequest(1, 1))
      .expect(201)
      .expect({
        id: 1,
      });
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});
