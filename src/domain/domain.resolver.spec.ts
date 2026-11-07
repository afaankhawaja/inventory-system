import { PrismaService } from 'src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DomainsResolver } from './domain.resolver';
import { DomainsService } from './domain.service';

describe('DomainsResolver', () => {
  let resolver: DomainsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: {} }, DomainsResolver, DomainsService],
    }).compile();

    resolver = module.get<DomainsResolver>(DomainsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
