import { Module } from '@nestjs/common';
import { RequestMeetController } from './request-meet.controller';

@Module({
  controllers: [RequestMeetController],
})
export class RequestMeetModule {}
