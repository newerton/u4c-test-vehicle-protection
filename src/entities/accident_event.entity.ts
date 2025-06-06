import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccidentEventUser } from './accident_event_user.entity';
import { User } from './user.entity';

@Entity('accident_event')
export class AccidentEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Exclude()
  user_id: string;

  @Column()
  vehicle: string;

  @Column()
  year: number;

  @Column()
  license_plate: string;

  @Column({ type: 'varchar', length: 2048 })
  description: string;

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

  @ManyToOne(() => User, (user) => user.accidentEvents)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(
    () => AccidentEventUser,
    (accidentEventUser) => accidentEventUser.accidentEvent,
  )
  users: AccidentEventUser[];
}
