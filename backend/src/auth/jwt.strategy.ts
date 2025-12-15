import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { CustomersService } from '../customers/customers.service';
import { Customer } from '../customers/entities/customer.entity';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private customersService: CustomersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Try cookie first
        (request: Request): string | null => {
          return (request?.cookies?.access_token as string | undefined) || null;
        },
        // Fallback to Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<Customer, 'password'>> {
    // Load user from database to ensure they still exist and are valid
    const customer = await this.customersService.findOne(payload.sub);
    if (!customer) {
      throw new UnauthorizedException('User not found');
    }
    // Passport automatically attaches this to request.user
    return customer;
  }
}
