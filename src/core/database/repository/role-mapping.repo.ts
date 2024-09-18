import { DataSource, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { RoleMapping } from '../entity';

export class RoleMappingRepository extends Repository<RoleMapping> {
  constructor(@Inject('DataSource') dataSource: DataSource) {
    super(RoleMapping, dataSource.createEntityManager());
  }
}
