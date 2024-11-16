import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event,
  ) {}

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    return this.eventModel.create({
      ...createEventDto,
      creatorId: user.id,
    });
  }

  async findAll() {
    return this.eventModel.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async findOne(id: string) {
    const event = await this.eventModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: User) {
    const event = await this.findOne(id);

    if (event.creatorId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own events');
    }

    await event.update(updateEventDto);
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    const event = await this.findOne(id);

    if (event.creatorId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own events');
    }

    await event.destroy();
  }
}