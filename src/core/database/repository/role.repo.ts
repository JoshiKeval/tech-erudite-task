import { DataSource, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Role } from '../entity';

export class RoleRepository extends Repository<Role> {
  constructor(@Inject('DataSource') dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
}
