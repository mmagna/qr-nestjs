import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { EventsService } from './events.service';
  import { CreateEventDto } from './dto/create-event.dto';
  import { UpdateEventDto } from './dto/update-event.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { UserRole } from '../users/entities/user.entity';
  
  @ApiTags('events')
  @Controller('events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class EventsController {
    constructor(private readonly eventsService: EventsService) {}
  
    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
    @ApiOperation({ summary: 'Create new event' })
    create(@Body() createEventDto: CreateEventDto, @Request() req) {
      return this.eventsService.create(createEventDto, req.user);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all events' })
    findAll() {
      return this.eventsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get one event' })
    findOne(@Param('id') id: string) {
      return this.eventsService.findOne(id);
    }
  
    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
    @ApiOperation({ summary: 'Update event' })
    update(
      @Param('id') id: string,
      @Body() updateEventDto: UpdateEventDto,
      @Request() req,
    ) {
      return this.eventsService.update(id, updateEventDto, req.user);
    }
  
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
    @ApiOperation({ summary: 'Delete event' })
    remove(@Param('id') id: string, @Request() req) {
      return this.eventsService.remove(id, req.user);
    }
  }