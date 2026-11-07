import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';

describe('ItemsResolver', () => {
  let resolver: ItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: JwtService, useValue: {} }, { provide: PrismaService, useValue: {} }, ItemsResolver, ItemsService],
    }).compile();

    resolver = module.get<ItemsResolver>(ItemsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
