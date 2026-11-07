import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check-out: units leave the vault (issued to a custodian), so stock on hand
   * goes down. Check-in: units are returned, so stock goes back up.
   * Both run in one DB transaction so the log and the stock never disagree.
   */
  async checkOutItem(
    userId: string,
    itemId: string,
    quantity: number,
    purpose?: string,
  ) {
    return this.record('CHECK_OUT', userId, itemId, quantity, purpose);
  }

  async checkInItem(
    userId: string,
    itemId: string,
    quantity: number,
    purpose?: string,
  ) {
    return this.record('CHECK_IN', userId, itemId, quantity, purpose);
  }

  /** Units of an item that are currently out (checked out minus returned). */
  private async outstandingQuantity(
    tx: Prisma.TransactionClient,
    itemId: string,
  ) {
    const sumFor = async (type: 'CHECK_OUT' | 'CHECK_IN') => {
      const res = await tx.transaction.aggregate({
        where: {
          transaction_type: type,
          transactionItems: { some: { itemId } },
        },
        _sum: { quantity: true },
      });
      return res._sum.quantity ?? 0;
    };
    const [out, back] = await Promise.all([
      sumFor('CHECK_OUT'),
      sumFor('CHECK_IN'),
    ]);
    return Math.max(out - back, 0);
  }

  private async record(
    type: 'CHECK_OUT' | 'CHECK_IN',
    userId: string,
    itemId: string,
    quantity: number,
    purpose?: string,
  ) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException(
        'Quantity must be a whole number of at least 1',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { itemId } });
      if (!item) throw new NotFoundException('Item not found');

      if (type === 'CHECK_OUT') {
        // Guarded decrement: fails (count 0) if stock is insufficient, even
        // when two requests race each other.
        const { count } = await tx.item.updateMany({
          where: { itemId, quantity_in_stock: { gte: quantity } },
          data: { quantity_in_stock: { decrement: quantity } },
        });
        if (count === 0) {
          throw new BadRequestException(
            `Only ${item.quantity_in_stock ?? 0} in stock, cannot check out ${quantity}`,
          );
        }
      } else {
        const outstanding = await this.outstandingQuantity(tx, itemId);
        if (quantity > outstanding) {
          throw new BadRequestException(
            outstanding === 0
              ? 'Nothing is currently checked out for this item'
              : `Only ${outstanding} currently checked out, cannot check in ${quantity}`,
          );
        }
        await tx.item.update({
          where: { itemId },
          data: { quantity_in_stock: { increment: quantity } },
        });
      }

      return tx.transaction.create({
        data: {
          transaction_type: type,
          quantity,
          purpose: purpose?.trim() || undefined,
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
