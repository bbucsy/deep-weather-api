import { Controller, Get, Redirect } from '@nestjs/common';
import { RequiredRole } from './app/auth/role.guard';
import { Role } from './app/user/user-role.enum';

@Controller()
export class AppController {
  @Get()
  @RequiredRole(Role.Guest)
  @Redirect('/api')
  index() {
    //redirect to api
  }
}
