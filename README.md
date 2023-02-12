```
 PASS  test/request-meet.e2e-spec.ts
  RequestMeetController
    ✓ throws a bad request when the caregiver does not exist (55 ms)
    ✓ throws a bad request when the caregiver is not available (54 ms)
    ✓ returns the id for the created request (50 ms)

 PASS  test/reply-to-meet-request.e2e-spec.ts
  ReplyToMeetRequestController
    ✓ throws a not found exception when the request does not exist (58 ms)
    ✓ sets the proper status (70 ms)
    ✓ sets the proper status (60 ms)
    ✓ does not allow me to set the status when its not pending (54 ms)
    ✓ does not allow me to set the status when its not pending (62 ms)
```

