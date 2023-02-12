import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetRequestEntity } from '../../core/meet-request.entity';

export enum CaregiverStatus {
  Available,
  NotAvailable,
}

@Entity({
  name: 'Caregivers',
})
export class CaregiverEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({
    type: 'enum',
    enum: CaregiverStatus,
    default: CaregiverStatus.Available,
  })
  public status: CaregiverStatus;

  @OneToMany(() => MeetRequestEntity, (entity) => entity.caregiverId)
  public request: MeetRequestEntity;

  public isAvailable(): boolean {
    return this.status === CaregiverStatus.Available;
  }
}
