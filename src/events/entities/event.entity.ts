import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Table
export class Event extends Model {
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
    allowNull: false,
  })
  name: string;

  @ApiProperty()
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacity: number;

  @ApiProperty()
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @ApiProperty({ enum: EventStatus })
  @Column({
    type: DataType.ENUM(...Object.values(EventStatus)),
    defaultValue: EventStatus.DRAFT,
  })
  status: EventStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;
}