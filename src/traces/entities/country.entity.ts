import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Trace } from './trace.entity';
import { Currency } from './currency.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'decimal' })
  distanceToUsa: number;

  @OneToMany(() => Trace, (trace) => trace.country)
  traces: Trace[];

  @OneToMany(() => Currency, (currency) => currency.country)
  currencies: Currency[];

  @CreateDateColumn({ nullable: true })
  createdOn: Date;

  @Column({ nullable: true })
  rateUpdatedOn: Date;
}
