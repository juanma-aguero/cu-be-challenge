import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Country } from './country.entity';

@Entity()
export class Trace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column({ type: 'decimal' })
  lat: number;

  @Column({ type: 'decimal' })
  lon: number;

  @Column()
  count: number;

  @ManyToOne(() => Country, (country) => country.traces, {
    cascade: ['insert'],
  })
  country: Country;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;
}
