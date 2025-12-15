import {
  IsArray,
  IsNumber,
  IsPositive,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  productIds: number[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  customerId: number;
}
