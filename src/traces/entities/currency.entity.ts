import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  code: string;

  @Column()
  symbol: string;

  @ManyToOne(() => Country, (country) => country.currencies)
  country: Country;

  @Column({ type: 'float' })
  rateToUsd: number;

  @Column()
  rateUpdatedOn: Date;
}
