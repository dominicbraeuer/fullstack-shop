import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      customerId: userId,
    });
    return this.orderRepository.save(order);
  }

  async findAll(userId: number): Promise<Order[]> {
    return this.orderRepository.find({ where: { customerId: userId } });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (order.customerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    userId: number,
  ): Promise<Order> {
    const order = await this.findOne(id, userId);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: number, userId: number): Promise<void> {
    const order = await this.findOne(id, userId);
    await this.orderRepository.remove(order);
  }
}
