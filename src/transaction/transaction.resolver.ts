import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transaction.service';
import { Transaction } from 'src/@generated/transaction/transaction.model';
import { TransactionPaginated } from 'src/pagination-dto/transaction-paginated.model';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionsService) {}

  @Mutation(() => Transaction)
  checkOut(
    @Args('userId') userId: string,
    @Args('itemId') itemId: string,
    @Args('quantity') quantity: number,
  ) {
    return this.transactionService.checkOutItem(userId, itemId, quantity);
  }

  @Mutation(() => Transaction)
  checkIn(
    @Args('userId') userId: string,
    @Args('itemId') itemId: string,
    @Args('quantity') quantity: number,
  ) {
    return this.transactionService.checkInItem(userId, itemId, quantity);
  }

  @Mutation(() => Transaction)
  removeTransaction(
    @Args('transactionId', { type: () => String }) transactionId: string,
  ) {
    return this.transactionService.remove(transactionId);
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(
    @Args('transactionId', { type: () => String }) transactionId: string,
  ) {
    return this.transactionService.findOne(transactionId);
  }

  @Query(() => TransactionPaginated, { name: 'transactionsWithItems' })
  getAllTransactionsWithItems(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.transactionService.findAllWithItems(skip, take);
  }
}
