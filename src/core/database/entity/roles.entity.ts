import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoleMapping } from './role-mapping.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'role_type', type: 'varchar', length: 50 })
  roleType: string;

  @OneToMany(() => RoleMapping, (roleMapping) => roleMapping.role)
  roleMappings: RoleMapping[];
}
