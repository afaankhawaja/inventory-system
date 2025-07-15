import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkOutItem(userId: string, itemId: string, quantity: number) {
    return this.prisma.transaction.create({
      data: {
        transaction_type: 'CHECK_OUT',
        quantity,
        transaction_date: new Date(),
        user: { connect: { userId } },
        transactionItems: {
          create: [{ item: { connect: { itemId } } }],
        },
        status: 'COMPLETED',
      },
      include: {
        user: true,
        transactionItems: { include: { item: true } },
      },
    });
  }

  async checkInItem(userId: string, itemId: string, quantity: number) {
    return this.prisma.transaction.create({
      data: {
        transaction_type: 'CHECK_IN',
        quantity,
        transaction_date: new Date(),
        user: { connect: { userId } },
        transactionItems: {
          create: [{ item: { connect: { itemId } } }],
        },
        status: 'COMPLETED',
      },
      include: {
        user: true,
        transactionItems: { include: { item: true } },
      },
    });
  }

  remove(transactionId: string) {
    return this.prisma.transaction.delete({
      where: { transactionId },
    });
  }

  findOne(transactionId: string) {
    return this.prisma.transaction.findUnique({
      where: { transactionId },
      include: {
        toLocationRef: true,
        fromLocationRef: true,
        user: true,
        transactionItems: true,
      },
    });
  }

  async findAllWithItems(skip?: number, take?: number) {
    const transactions = await this.prisma.transaction.findMany({
      skip,
      take,
      include: {
        transactionItems: {
          include: {
            item: {
              select: {
                itemId: true,
                name: true,
                price: true,
                is_high_value: true,
              },
            },
          },
        },
        user: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
      orderBy: {
        transaction_date: 'desc',
      },
    });
    const total = await this.prisma.transaction.count();
    return {
      transactions,
      total,
    };
  }
}
