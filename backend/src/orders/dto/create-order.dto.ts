import { IsArray, IsNumber, IsPositive, ArrayMinSize } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  productIds: number[];

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsNumber()
  @IsPositive()
  customerId: number;
}
