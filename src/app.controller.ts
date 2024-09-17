import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('/ping')
  ping() {
    console.log('ping->', new Date().toISOString());
    return {
      isError: false,
      message: 'PONG',
      data: {},
    };
  }
}
