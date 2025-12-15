import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { GetUser } from '../auth/get-user.decorator';
import { Customer } from '../customers/entities/customer.entity';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Get()
  async findAll(@GetUser() user: Omit<Customer, 'password'>): Promise<Order[]> {
    return this.ordersService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<Order> {
    return this.ordersService.findOne(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: number,
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<void> {
    return this.ordersService.remove(id, user.id);
  }
}
