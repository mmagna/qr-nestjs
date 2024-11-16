// src/tickets/tickets.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { GenerateTicketDto } from './dto/generate-ticket.dto';
import { ValidateTicketDto } from './dto/validate-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Generate ticket' })
  async generateTicket(
    @Body() generateTicketDto: GenerateTicketDto,
    @Request() req,
  ) {
    return this.ticketsService.generateTicket(generateTicketDto, req.user);
  }

  @Post('validate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER, UserRole.VALIDATOR)
  @ApiOperation({ summary: 'Validate ticket' })
  async validateTicket(
    @Body() validateTicketDto: ValidateTicketDto,
    @Request() req,
  ) {
    try {
      const result = await this.ticketsService.validateTicket(
        validateTicketDto,
        req.user,
      );
      return {
        message: 'Ticket validated successfully',
        ticket: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error validating ticket');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  async findAll(@Request() req) {
    return this.ticketsService.getAllTickets(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by id' })
  async findOne(@Param('id') id: string) {
    return this.ticketsService.getTicketById(id);
  }
}