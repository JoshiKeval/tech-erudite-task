import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  AccountVerifyRequestDto,
  LoginReqDto,
  RegistrationReqDto,
} from './dto';

@ApiTags('Users api')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for register user',
    description: 'Api for register user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Registered Successfully',
  })
  async register(@Body() payload: RegistrationReqDto) {
    return { message: await this.service.register(payload) };
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api to verify user account',
    description: 'Api to verify user account',
  })
  @ApiOkResponse({
    description: 'Email Verified Successfully',
  })
  async verifyAccount(@Body() payload: AccountVerifyRequestDto) {
    return {
      message: await this.service.validateKeyAndActivateAccount(payload.token),
    };
  }

  @Post('/admin-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api to login user',
    description: 'Api to login user',
  })
  @ApiOkResponse({
    description: 'Login Successfully',
  })
  async login(@Body() payload: LoginReqDto) {
    return {
      data: await this.service.adminLogin(payload),
    };
  }
}
