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
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

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
  async findAll(): Promise<CustomerResponse[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CustomerResponse> {
    return this.customersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponse> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.customersService.remove(id);
  }
}
