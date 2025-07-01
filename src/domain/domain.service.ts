import { Injectable } from '@nestjs/common';
import { DomainCreateInput } from 'src/@generated/domain/domain-create.input';
import { DomainUpdateInput } from 'src/@generated/domain/domain-update.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class DomainsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDomainInput: DomainCreateInput) {
    return this.prisma.domain.create({
      data: <Prisma.DomainCreateInput>{
        domainId: createDomainInput.domainId,
        name: createDomainInput.name,
        description: createDomainInput.description,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parentDomain: createDomainInput.parentDomain
          ? {
              ...(createDomainInput.parentDomain.create && {
                create: createDomainInput.parentDomain.create,
              }),
              ...(createDomainInput.parentDomain.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: createDomainInput.parentDomain.connect,
              }),
            }
          : undefined,
        userDomains: createDomainInput.userDomains
          ? {
              ...(createDomainInput.userDomains.create && {
                create: createDomainInput.userDomains.create,
              }),
              ...(createDomainInput.userDomains.connect && {
                connect: createDomainInput.userDomains.connect,
              }),
            }
          : undefined,
      },
      include: {
        parentDomain: true,
        subDomains: true,
        userDomains: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.domain.findMany({
      include: {
        parentDomain: true,
        subDomains: true,
        userDomains: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  findOne(domainID: string) {
    return this.prisma.domain.findUnique({
      where: { domainId: domainID },
      include: {
        parentDomain: true,
        subDomains: true,
        userDomains: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  update(domainID: string, updateDomainInput: DomainUpdateInput) {
    return this.prisma.domain.update({
      where: {
        domainId: domainID,
      },
      include: {
        parentDomain: true,
        subDomains: true,
        userDomains: {
          include: {
            user: true,
          },
        },
      },
      data: <Prisma.DomainUpdateInput>{
        name: updateDomainInput.name,
        description: updateDomainInput.description,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parentDomain: updateDomainInput.parentDomain
          ? {
              ...(updateDomainInput.parentDomain.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: updateDomainInput.parentDomain.connect,
              }),
              ...(updateDomainInput.parentDomain.disconnect && {
                disconnect: updateDomainInput.parentDomain.disconnect,
              }),
              ...(updateDomainInput.parentDomain.update && {
                update: updateDomainInput.parentDomain.update,
              }),
            }
          : undefined,
        userDomains: updateDomainInput.userDomains
          ? {
              ...(updateDomainInput.userDomains.create && {
                create: updateDomainInput.userDomains.create,
              }),
              ...(updateDomainInput.userDomains.connect && {
                connect: updateDomainInput.userDomains.connect,
              }),
              ...(updateDomainInput.userDomains.disconnect && {
                disconnect: updateDomainInput.userDomains.disconnect,
              }),
              ...(updateDomainInput.userDomains.delete && {
                delete: updateDomainInput.userDomains.delete,
              }),
            }
          : undefined,
      },
    });
  }

  remove(domainID: string) {
    return this.prisma.domain.delete({
      where: {
        domainId: domainID,
      },
    });
  }

  // methods for managing user-domain relationships
  async assignUserToDomain(userId: string, domainId: string) {
    return this.prisma.userDomain.create({
      data: {
        userId,
        domainId,
      },
      include: {
        user: true,
        domain: true,
      },
    });
  }

  async removeUserFromDomain(userId: string, domainId: string) {
    return this.prisma.userDomain.delete({
      where: {
        userId_domainId: {
          userId,
          domainId,
        },
      },
    });
  }

  async getUsersInDomain(domainId: string) {
    return this.prisma.userDomain.findMany({
      where: { domainId },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async getDomainsForUser(userId: string) {
    return this.prisma.userDomain.findMany({
      where: { userId },
      include: {
        domain: {
          include: {
            parentDomain: true,
            subDomains: true,
          },
        },
      },
    });
  }
}
