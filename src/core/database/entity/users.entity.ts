import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Status } from '../../interfaces';

@Entity('users')
export class Users extends Base {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @Column({ name: 'role', type: 'varchar', length: 10 })
  role: string;

  @Column({ name: 'email_verification_token', type: 'varchar', length: 200 })
  emailVerificationToken: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 200,
    default: Status.Inactive,
  })
  status: string;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;
}
