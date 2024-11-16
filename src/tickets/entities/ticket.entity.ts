import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

export enum TicketStatus {
  VALID = 'valid',
  USED = 'used',
  CANCELLED = 'cancelled',
}

@Table
export class Ticket extends Model {
  @ApiProperty()
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  qrCode: string;

  @ApiProperty({ enum: TicketStatus })
  @Column({
    type: DataType.ENUM(...Object.values(TicketStatus)),
    defaultValue: TicketStatus.VALID,
  })
  status: TicketStatus;

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  usedAt: Date;

  // Relación con Event
  @ForeignKey(() => Event)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  eventId: string;

  @BelongsTo(() => Event)
  event: Event;

  // Relación con User (owner)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'owner'
  })
  owner: User;

  // Relación con User (validator)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  validatedById: string;

  @BelongsTo(() => User, {
    foreignKey: 'validatedById',
    as: 'validator'
  })
  validator: User;
}