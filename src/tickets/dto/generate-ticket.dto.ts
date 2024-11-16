import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTicketDto {
  @ApiProperty({ description: 'ID of the event' })
  @IsUUID()
  eventId: string;
}
