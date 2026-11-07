import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PurchaseHistoryService } from './purchase-history.service';
import { PurchaseHistoryCreateInput } from 'src/@generated/purchase-history/purchase-history-create.input';

describe('PurchaseHistoryService', () => {
  let service: PurchaseHistoryService;
  const tx = {
    purchaseHistory: { create: jest.fn() },
    item: { update: jest.fn() },
  };
  const prisma = {
    $transaction: jest.fn((cb: (t: typeof tx) => unknown) => cb(tx)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    tx.purchaseHistory.create.mockResolvedValue({ purchaseId: 'p1' });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseHistoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(PurchaseHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('restock adds the purchased quantity to the item stock', async () => {
    await service.create({
      quantity: 7,
      item: { connect: { itemId: 'i1' } },
    } as unknown as PurchaseHistoryCreateInput);
    expect(tx.purchaseHistory.create).toHaveBeenCalled();
    expect(tx.item.update).toHaveBeenCalledWith({
      where: { itemId: 'i1' },
      data: { quantity_in_stock: { increment: 7 } },
    });
  });

  it('does not touch stock when there is no connected item', async () => {
    await service.create({ quantity: 7 } as unknown as PurchaseHistoryCreateInput);
    expect(tx.item.update).not.toHaveBeenCalled();
  });
});