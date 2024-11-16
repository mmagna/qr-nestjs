import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateTicketDto {
  @ApiProperty({ description: 'QR code of the ticket' })
  @IsString()
  qrCode: string;
}