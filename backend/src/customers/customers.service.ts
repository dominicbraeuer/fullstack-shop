import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Omit<Customer, 'password'>> {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(createCustomerDto.password, salt);
    const user = this.customerRepository.create({
      ...createCustomerDto,
      password: hashed,
    });
    const saved = await this.customerRepository.save(user);
    const { id: savedId, name, email } = saved;
    return { id: savedId, name, email };
  }

  async findAll(): Promise<Omit<Customer, 'password'>[]> {
    const customers = await this.customerRepository.find();
    return customers.map(({ id, name, email }) => ({ id, name, email }));
  }

  async findOne(id: number): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    const { id: customerId, name, email } = customer;
    return { id: customerId, name, email };
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    Object.assign(customer, updateCustomerDto);
    const saved = await this.customerRepository.save(customer);
    const { id: customerId, name, email } = saved;
    return { id: customerId, name, email };
  }

  async remove(id: number): Promise<void> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    await this.customerRepository.remove(customer);
  }
}
