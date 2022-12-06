import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TraceInputDto {
  @Field()
  ip: string;
}
