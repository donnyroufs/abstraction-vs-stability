import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { MeetRequestEntity } from '../../core/meet-request.entity';
import { ReplyRequest } from './reply.request';

@Controller('request-meet/:id/reply')
export class ReplyToMeetRequestController {
  @Patch()
  @HttpCode(204)
  public async handle(
    @Body() data: ReplyRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const request = await MeetRequestEntity.findOneBy({
      id,
    });

    if (!request) {
      throw new NotFoundException();
    }

    if (data.accepted) {
      request.accept();
    } else {
      request.decline();
    }

    await request.save();
  }
}
