import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccidentEvent } from './accident_event.entity';
import { User } from './user.entity';

@Entity('accident_event_user')
export class AccidentEventUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Exclude()
  accident_event_id: string;

  @Column('uuid')
  @Exclude()
  user_id: string;

  @Exclude()
  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true, select: false })
  deleted_at: Date;

  @ManyToOne(() => AccidentEvent, (accidentEvent) => accidentEvent.users)
  @JoinColumn({ name: 'accident_event_id' })
  accidentEvent: AccidentEvent;

  @ManyToOne(() => User, (user) => user.accidentEventUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
