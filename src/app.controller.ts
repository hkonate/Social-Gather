import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  Welcome() {
    return 'Welcome to SocialGather API';
  }
}
