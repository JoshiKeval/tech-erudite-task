import { Global, Module } from '@nestjs/common';
import { DbConnection } from './connection';
import {
  RoleMappingRepository,
  RoleRepository,
  UsersRepository,
} from './repository';

const PG_REPOSITORIES = [
  UsersRepository,
  RoleRepository,
  RoleMappingRepository,
];
@Global()
@Module({
  providers: [...DbConnection, ...PG_REPOSITORIES],
  exports: [...DbConnection, ...PG_REPOSITORIES],
})
export class DatabaseModule {}
