import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  VALIDATOR = 'validator',
  CLIENT = 'client',
}

@Table
export class User extends Model {
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
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ enum: UserRole })
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.CLIENT,
  })
  role: UserRole;
}