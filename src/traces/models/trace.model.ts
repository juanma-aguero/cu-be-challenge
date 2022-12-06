import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Trace {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  ip: string;

  @Field({ nullable: true })
  lat: number;

  @Field({ nullable: true })
  lon: number;
}
