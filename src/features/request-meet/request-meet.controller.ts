import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { MeetRequestEntity, RequestStatus } from './meet-request.entity';
import { RequestMeetRequest } from './request-meet.request';
import { RequestMeetResponse } from './request-meet.response';
import { CaregiverEntity } from './caregiver.entity';

@Controller('request-meet')
export class RequestMeetController {
  @Post()
  public async handle(@Body() data: RequestMeetRequest): Promise<any> {
    const request = new MeetRequestEntity();
    const caregiver = await CaregiverEntity.findOneBy({
      id: data.caregiverId,
    });

    if (!caregiver || !caregiver.isAvailable()) {
      throw new BadRequestException('Caregiver is not available');
    }

    request.status = RequestStatus.Pending;
    request.caregiverId = data.caregiverId;
    request.clientId = data.clientId;

    const created = await request.save();

    return new RequestMeetResponse(created.id);
  }
}
