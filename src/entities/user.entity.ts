import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_TYPE {
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: USER_TYPE;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  repeat_password: string;

  @Column()
  document: string;

  @Column({ type: 'date', nullable: true })
  birthday?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  is_active?: boolean;

  @Exclude()
  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;
}
