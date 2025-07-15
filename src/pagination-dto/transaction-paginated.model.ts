import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transaction } from 'src/@generated/transaction/transaction.model';

@ObjectType()
export class TransactionPaginated {
  @Field(() => [Transaction])
  transactions: Transaction[];

  @Field(() => Int)
  total: number;
}
