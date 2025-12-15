import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; customerId: number }> {
    const { email, password } = loginDto;

    const customer = await this.customerRepository.findOneBy({ email });
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: customer.id, email: customer.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      customerId: customer.id,
    };
  }

  async validateUser(userId: number): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository.findOneBy({ id: userId });
    if (!customer) {
      throw new UnauthorizedException('User not found');
    }
    const { id, name, email } = customer;
    return { id, name, email };
  }
}
