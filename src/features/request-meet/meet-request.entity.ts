import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CaregiverEntity } from './caregiver.entity';

export enum RequestStatus {
  Pending = 0,
  Accepted,
  Declined,
}

@Entity({
  name: 'MeetRequests',
})
export class MeetRequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.Pending,
  })
  public status: RequestStatus;

  @ManyToOne(() => CaregiverEntity, (caregiver) => caregiver.id)
  public caregiverId: number;

  @Column()
  public clientId: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
