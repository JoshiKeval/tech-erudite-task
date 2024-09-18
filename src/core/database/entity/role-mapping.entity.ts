import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Users } from './users.entity';
import { Role } from './roles.entity';

@Entity('role_mappings')
export class RoleMapping {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Users, (user) => user.roleMappings)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Role, (role) => role.roleMappings)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @Column({ type: 'varchar', length: 200 })
  role_id: string;
}
