import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetUser } from '../auth/get-user.decorator';
import { Customer } from './entities/customer.entity';

type CustomerResponse = Omit<CreateCustomerDto, 'password'> & { id: number };

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponse> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<CustomerResponse[]> {
    // Users can only see their own customer data
    return [await this.customersService.findOne(user.id)];
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('id') id: number,
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<CustomerResponse> {
    if (id !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return this.customersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<CustomerResponse> {
    if (id !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: number,
    @GetUser() user: Omit<Customer, 'password'>,
  ): Promise<void> {
    if (id !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return this.customersService.remove(id);
  }
}
