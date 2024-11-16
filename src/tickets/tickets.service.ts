// src/tickets/tickets.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';
import { GenerateTicketDto } from './dto/generate-ticket.dto';
import { ValidateTicketDto } from './dto/validate-ticket.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket)
    private ticketModel: typeof Ticket,
    @InjectModel(Event)
    private eventModel: typeof Event,
  ) {}

  private generateQRCode(): string {
    return crypto
      .randomBytes(8)
      .toString('hex');
  }

  private async getTicketWithRelations(where: any) {
    return this.ticketModel.findOne({
      where,
      include: [
        {
          model: Event,
          attributes: ['id', 'name', 'date', 'location'],
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'validator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async validateTicket(validateTicketDto: ValidateTicketDto, validator: User) {
    const ticket = await this.getTicketWithRelations({ 
      qrCode: validateTicketDto.qrCode 
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.status !== TicketStatus.VALID) {
      throw new BadRequestException(`Ticket is already ${ticket.status}`);
    }

    await ticket.update({
      status: TicketStatus.USED,
      usedAt: new Date(),
      validatedById: validator.id,
    });

    return this.getTicketById(ticket.id);
  }

  async getTicketById(id: string) {
    const ticket = await this.getTicketWithRelations({ id });
    
    if (!ticket) {
      throw new NotFoundException(`Ticket #${id} not found`);
    }

    return ticket;
  }

  async getAllTickets(user: User) {
    const where = user.role === 'admin' ? {} : { userId: user.id };
    
    return this.ticketModel.findAll({
      where,
      include: [
        {
          model: Event,
          attributes: ['id', 'name', 'date', 'location'],
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'validator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async generateTicket(generateTicketDto: GenerateTicketDto, user: User) {
    // Verificar si el evento existe
    const event = await this.eventModel.findByPk(generateTicketDto.eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verificar capacidad
    const ticketCount = await this.ticketModel.count({
      where: { 
        eventId: generateTicketDto.eventId,
        status: TicketStatus.VALID 
      }
    });

    if (ticketCount >= event.capacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    // Generar ticket con QR único
    const ticket = await this.ticketModel.create({
      eventId: generateTicketDto.eventId,
      userId: user.id,
      status: TicketStatus.VALID,
      qrCode: this.generateQRCode(),
    });

    const generatedTicket = await this.getTicketById(ticket.id);
    const qrImage = await QRCode.toDataURL(generatedTicket.qrCode);

    return {
      ticket: generatedTicket,
      qrImage,
    };
  }
}