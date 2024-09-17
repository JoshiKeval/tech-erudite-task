import { DataSource, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Users } from '../entity';

export class UsersRepository extends Repository<Users> {
  constructor(@Inject('DataSource') dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }
}
