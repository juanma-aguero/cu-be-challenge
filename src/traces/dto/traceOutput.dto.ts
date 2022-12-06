import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CurrencyResponseDto {
  @Field()
  iso: string;

  @Field({ nullable: true })
  symbol?: string;

  @Field()
  conversion_rate: number;
}

@ObjectType()
export class TraceOutputDto {
  @Field({ nullable: true })
  ip?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  lat?: number;

  @Field({ nullable: true })
  lon?: number;

  @Field(() => [CurrencyResponseDto])
  currencies: CurrencyResponseDto[];
}
