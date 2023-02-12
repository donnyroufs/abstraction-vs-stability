import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeetRequestEntity } from './features/request-meet/meet-request.entity';
import { RequestMeetModule } from './features/request-meet/request-meet.module';
import { CaregiverEntity } from './features/request-meet/caregiver.entity';
import { ReplyToMeetRequestModule } from './features/reply-to-meet-request/reply-to-meet-request.module';

const features = [RequestMeetModule, ReplyToMeetRequestModule];

@Module({
  imports: [
    ...features,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'beeldzorg',
      entities: [MeetRequestEntity, CaregiverEntity],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
