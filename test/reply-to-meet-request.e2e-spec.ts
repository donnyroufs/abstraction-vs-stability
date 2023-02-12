import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  CaregiverEntity,
  CaregiverStatus,
} from '../src/features/request-meet/caregiver.entity';
import { DataSource } from 'typeorm';
import { ReplyRequest } from '../src/features/reply-to-meet-request/reply.request';
import {
  MeetRequestEntity,
  RequestStatus,
} from '../src/features/request-meet/meet-request.entity';

describe('ReplyToMeetRequestController', () => {
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
    await repo.query(`TRUNCATE "MeetRequests" RESTART IDENTITY CASCADE;`);
  });

  test('throws a not found exception when the request does not exist', async () => {
    return request(app.getHttpServer())
      .patch('/request-meet/1/reply')
      .send(new ReplyRequest(true))
      .expect(404);
  });

  test.each([[true], [false]])(
    'sets the proper status',
    async (status: boolean) => {
      const caregiver = new CaregiverEntity();
      caregiver.id = 1;
      caregiver.name = 'john';
      caregiver.status = CaregiverStatus.NotAvailable;
      await caregiver.save();

      const meetRequest = new MeetRequestEntity();

      meetRequest.id = 1;
      meetRequest.status = RequestStatus.Pending;
      meetRequest.caregiverId = 1;
      meetRequest.clientId = 1;

      await meetRequest.save();

      await request(app.getHttpServer())
        .patch('/request-meet/1/reply')
        .send(new ReplyRequest(status))
        .expect(204);

      const confirmation = await MeetRequestEntity.findOneBy({
        id: 1,
        status: status ? RequestStatus.Accepted : RequestStatus.Declined,
      });

      expect(confirmation).toBeDefined();
    },
  );

  test.each([[true], [false]])(
    'does not allow me to set the status when its not pending',
    async (status: boolean) => {
      const caregiver = new CaregiverEntity();
      caregiver.id = 1;
      caregiver.name = 'john';
      caregiver.status = CaregiverStatus.NotAvailable;
      await caregiver.save();

      const meetRequest = new MeetRequestEntity();

      meetRequest.id = 1;
      meetRequest.status = status
        ? RequestStatus.Accepted
        : RequestStatus.Declined;
      meetRequest.caregiverId = 1;
      meetRequest.clientId = 1;

      await meetRequest.save();

      await request(app.getHttpServer())
        .patch('/request-meet/1/reply')
        .send(new ReplyRequest(!status))
        .expect(204);

      const confirmation = await MeetRequestEntity.findOneBy({
        id: 1,
        status: status ? RequestStatus.Accepted : RequestStatus.Declined,
      });

      expect(confirmation).not.toBe(null);
    },
  );

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});
