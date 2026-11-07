import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionsService } from './transaction.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  // Minimal in-memory stand-in for the Prisma client used inside $transaction.
  const tx = {
    item: { findUnique: jest.fn(), updateMany: jest.fn(), update: jest.fn() },
    transaction: { aggregate: jest.fn(), create: jest.fn() },
  };
  const prisma = {
    $transaction: jest.fn((cb: (t: typeof tx) => unknown) => cb(tx)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    tx.transaction.create.mockResolvedValue({ transactionId: 't1' });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.each([0, -1, 1.5, NaN])('rejects invalid quantity %p', async (q) => {
    await expect(service.checkOutItem('u', 'i', q)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects unknown item', async () => {
    tx.item.findUnique.mockResolvedValue(null);
    await expect(service.checkOutItem('u', 'i', 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('check-out decrements stock and logs the transaction', async () => {
    tx.item.findUnique.mockResolvedValue({ quantity_in_stock: 5 });
    tx.item.updateMany.mockResolvedValue({ count: 1 });
    await service.checkOutItem('u', 'i', 2, ' display ');
    expect(tx.item.updateMany).toHaveBeenCalledWith({
      where: { itemId: 'i', quantity_in_stock: { gte: 2 } },
      data: { quantity_in_stock: { decrement: 2 } },
    });
    expect(tx.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          transaction_type: 'CHECK_OUT',
          quantity: 2,
          purpose: 'display',
        }),
      }),
    );
  });

  it('check-out is rejected when stock is insufficient', async () => {
    tx.item.findUnique.mockResolvedValue({ quantity_in_stock: 1 });
    tx.item.updateMany.mockResolvedValue({ count: 0 });
    await expect(service.checkOutItem('u', 'i', 2)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(tx.transaction.create).not.toHaveBeenCalled();
  });

  it('check-in increments stock when units are outstanding', async () => {
    tx.item.findUnique.mockResolvedValue({ quantity_in_stock: 3 });
    // 4 checked out, 1 already returned -> 3 outstanding
    tx.transaction.aggregate
      .mockResolvedValueOnce({ _sum: { quantity: 4 } })
      .mockResolvedValueOnce({ _sum: { quantity: 1 } });
    await service.checkInItem('u', 'i', 3);
    expect(tx.item.update).toHaveBeenCalledWith({
      where: { itemId: 'i' },
      data: { quantity_in_stock: { increment: 3 } },
    });
    expect(tx.transaction.create).toHaveBeenCalled();
  });

  it('check-in is rejected when it exceeds what is checked out', async () => {
    tx.item.findUnique.mockResolvedValue({ quantity_in_stock: 3 });
    tx.transaction.aggregate
      .mockResolvedValueOnce({ _sum: { quantity: 2 } })
      .mockResolvedValueOnce({ _sum: { quantity: 1 } });
    await expect(service.checkInItem('u', 'i', 2)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(tx.item.update).not.toHaveBeenCalled();
    expect(tx.transaction.create).not.toHaveBeenCalled();
  });
});