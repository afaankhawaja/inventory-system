import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Alert } from 'src/@generated/alert/alert.model';

@ObjectType()
export class AlertsPaginated {
  @Field(() => [Alert])
  alerts: Alert[];

  @Field(() => Int)
  total: number;
}
