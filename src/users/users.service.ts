import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginReqDto, RegistrationReqDto } from './dto';
import { UsersRepository } from '../core/database/repository';
import {
  comparePassword,
  generateSHA1,
  hash,
  jwtSign,
  Roles,
  Status,
} from '../core';
import { Users } from '../core/database/entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly mailService: MailService,
  ) {}

  async register(payload: RegistrationReqDto) {
    const isUserExist = await this.isUserExist(payload?.email, payload?.role);
    if (isUserExist) {
      throw new BadRequestException('Account already exist');
    }
    const hashedPassword = await hash(payload?.password);
    const hashedEmail = generateSHA1(payload?.email);
    const user = this.userRepo.create({
      firstName: payload?.firstName,
      lastName: payload?.lastName,
      email: payload?.email,
      password: hashedPassword,
      role: payload?.role,
      emailVerificationToken: hashedEmail,
    });
    await this.userRepo.save(user);
    this.mailService.sendRegistrationEmail(payload?.email, hashedEmail);
    return 'User Registered Successfully.Please Verfy Your Email.';
  }

  async validateKeyAndActivateAccount(token: string): Promise<string> {
    const user = await this.userRepo.findOneBy({
      emailVerificationToken: token,
    });
    if (user.status === Status.Active) {
      throw new BadRequestException('Account already verified');
    }

    user.status = Status.Active;
    user.emailVerifiedAt = new Date();

    await this.userRepo.save(user);

    return 'Email Verified Successfully';
  }

  async adminLogin(payload: LoginReqDto) {
    if (payload?.role === Roles.CUSTOMER) {
      throw new BadRequestException('You are not allowed to login from here');
    }
    const user = await this.isUserExist(payload?.email, payload?.role);
    if (!user) {
      throw new UnauthorizedException('Invalid login creads.');
    }
    if (user.status === Status.Inactive) {
      throw new BadRequestException('Email varification is pendding');
    }
    const isCorrectPassword = await comparePassword(
      payload?.password,
      user?.password,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid login creads.');
    }

    const tokenDto = {
      id: user.id,
      role: user.role,
      status: user.status,
    };

    const jwtToken = jwtSign(tokenDto);
    return jwtToken;
  }

  async isUserExist(email: string, role: string): Promise<Users> {
    const user = await this.userRepo.findOneBy({ email, role });
    return user;
  }
}
