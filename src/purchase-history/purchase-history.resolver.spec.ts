import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseHistoryResolver } from './purchase-history.resolver';
import { PurchaseHistoryService } from './purchase-history.service';

describe('PurchaseHistoryResolver', () => {
  let resolver: PurchaseHistoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseHistoryResolver, PurchaseHistoryService],
    }).compile();

    resolver = module.get<PurchaseHistoryResolver>(PurchaseHistoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
