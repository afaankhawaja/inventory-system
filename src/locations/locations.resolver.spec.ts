import { PrismaService } from 'src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';

describe('LocationsResolver', () => {
  let resolver: LocationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: {} }, LocationsResolver, LocationsService],
    }).compile();

    resolver = module.get<LocationsResolver>(LocationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
