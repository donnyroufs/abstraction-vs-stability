import { Module } from '@nestjs/common';
import { ReplyToMeetRequestController } from './reply-to-meet-request.controller';

@Module({
  controllers: [ReplyToMeetRequestController],
})
export class ReplyToMeetRequestModule {}
