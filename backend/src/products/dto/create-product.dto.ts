import { IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;
}
