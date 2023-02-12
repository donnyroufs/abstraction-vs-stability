export class RequestMeetRequest {
  public constructor(
    public readonly caregiverId: number,
    public readonly clientId: number,
  ) {}
}
