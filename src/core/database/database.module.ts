import { Global, Module } from '@nestjs/common';
import { DbConnection } from './connection';
import { UsersRepository } from './repository';

const PG_REPOSITORIES = [UsersRepository];
@Global()
@Module({
  providers: [...DbConnection, ...PG_REPOSITORIES],
  exports: [...DbConnection, ...PG_REPOSITORIES],
})
export class DatabaseModule {}
