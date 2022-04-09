import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getHello() {
    return {
      message: 'Welcome',
    };
  }
}
