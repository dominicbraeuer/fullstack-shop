import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  productIds: number[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  customerId: number;
}
