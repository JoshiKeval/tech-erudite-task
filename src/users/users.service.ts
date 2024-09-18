import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginReqDto, RegistrationReqDto } from './dto';
import {
  UsersRepository,
  RoleRepository,
  RoleMappingRepository,
} from '../core/database/repository';
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
    private readonly roleRepo: RoleRepository,
    private readonly roleMappingRepo: RoleMappingRepository,
    private readonly mailService: MailService,
  ) {}

  async register(payload: RegistrationReqDto) {
    const isUserExist = await this.isUserExist(payload?.email, payload?.role);
    if (isUserExist) {
      throw new BadRequestException('Account already exists');
    }

    const hashedPassword = await hash(payload?.password);
    const hashedEmail = generateSHA1(payload?.email);

    const user = this.userRepo.create({
      firstName: payload?.firstName,
      lastName: payload?.lastName,
      email: payload?.email,
      password: hashedPassword,
      emailVerificationToken: hashedEmail,
    });

    const savedUser = await this.userRepo.save(user);

    const role = await this.roleRepo.findOne({
      where: { roleType: payload?.role },
    });
    if (!role) {
      throw new BadRequestException('Role does not exist');
    }

    const roleMapping = this.roleMappingRepo.create({
      user: savedUser,
      role_id: role.id,
    });

    await this.roleMappingRepo.save(roleMapping);
    this.mailService.sendRegistrationEmail(payload?.email, hashedEmail);

    return 'User registered successfully. Please verify your email.';
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
    const user = await this.userRepo.findOneBy({ email: payload?.email });
    if (!user) {
      throw new UnauthorizedException('Invalid login credential.');
    }

    const userRoles = await this.roleMappingRepo.find({
      where: { user: { id: user.id } },
      relations: ['role'],
    });
    const hasAdminRole = userRoles.some(
      (roleMapping) => roleMapping.role.roleType === Roles.ADMIN,
    );

    if (!hasAdminRole) {
      throw new BadRequestException(
        'You do not have permission to access this resource',
      );
    }

    if (user.status === Status.Inactive) {
      throw new BadRequestException('Email verification is pending');
    }

    const isCorrectPassword = await comparePassword(
      payload?.password,
      user?.password,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid login credential.');
    }

    const tokenDto = {
      id: user.id,
      role:
        user.roleMappings?.map((mapping) => mapping.role_id).join(', ') || '',
      status: user.status,
    };

    const jwtToken = jwtSign(tokenDto);
    return jwtToken;
  }

  async isUserExist(email: string, role: string): Promise<Users> {
    const user = await this.userRepo.findOne({
      where: { email, roleMappings: { role: { roleType: role } } },
      relations: ['roleMappings'],
    });
    return user;
  }
}
