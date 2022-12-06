import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatsItemOutputDto {
  @Field()
  country: string;

  @Field()
  value: number;
}

@ObjectType()
export class StatsOutputDto {
  @Field(() => StatsItemOutputDto)
  longest_distance: StatsItemOutputDto;

  @Field(() => StatsItemOutputDto)
  most_traced: StatsItemOutputDto;
}
