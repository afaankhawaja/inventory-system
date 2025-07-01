import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorCreateInput } from 'src/@generated/vendor/vendor-create.input';
import { VendorUpdateInput } from 'src/@generated/vendor/vendor-update.input';
import { Prisma } from 'generated/prisma';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  create(vendorCreateInput: VendorCreateInput) {
    return this.prisma.vendor.create({
      data: <Prisma.VendorCreateInput>{
        name: vendorCreateInput.name,
        phone: vendorCreateInput.phone,
        address: vendorCreateInput.address,
        is_active: vendorCreateInput.is_active,
        rating: vendorCreateInput.rating,
        age: vendorCreateInput.age,
        cnic: vendorCreateInput.cnic,
        image_path: vendorCreateInput.image_path,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        location: vendorCreateInput.location
          ? {
              ...(vendorCreateInput.location.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: vendorCreateInput.location.connect,
              }),
              ...(vendorCreateInput.location.create && {
                create: vendorCreateInput.location.create,
              }),
            }
          : undefined,
        receipts: vendorCreateInput.receipts
          ? {
              ...(vendorCreateInput.receipts.connect && {
                connect: vendorCreateInput.receipts.connect,
              }),
              ...(vendorCreateInput.receipts.create && {
                create: vendorCreateInput.receipts.create,
              }),
            }
          : undefined,
        purchaseHistories: vendorCreateInput.purchaseHistories
          ? {
              ...(vendorCreateInput.purchaseHistories.connect && {
                connect: vendorCreateInput.purchaseHistories.connect,
              }),
              ...(vendorCreateInput.purchaseHistories.create && {
                create: vendorCreateInput.purchaseHistories.create,
              }),
            }
          : undefined,
      },
      include: {
        location: true,
        receipts: true,
        purchaseHistories: true,
      },
    });
  }

  update(vendorID: string, vendorUpdateInput: VendorUpdateInput) {
    return this.prisma.vendor.update({
      where: { vendorId: vendorID },
      data: <Prisma.VendorUpdateInput>{
        name: vendorUpdateInput.name,
        phone: vendorUpdateInput.phone,
        address: vendorUpdateInput.address,
        is_active: vendorUpdateInput.is_active,
        rating: vendorUpdateInput.rating,
        age: vendorUpdateInput.age,
        cnic: vendorUpdateInput.cnic,
        image_path: vendorUpdateInput.image_path,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        location: vendorUpdateInput.location
          ? {
              ...(vendorUpdateInput.location.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: vendorUpdateInput.location.connect,
              }),
              ...(vendorUpdateInput.location.disconnect && {
                disconnect: vendorUpdateInput.location.disconnect,
              }),
              ...(vendorUpdateInput.location.create && {
                create: vendorUpdateInput.location.create,
              }),
              ...(vendorUpdateInput.location.update && {
                update: vendorUpdateInput.location.update,
              }),
            }
          : undefined,
        receipts: vendorUpdateInput.receipts
          ? {
              ...(vendorUpdateInput.receipts.connect && {
                connect: vendorUpdateInput.receipts.connect,
              }),
              ...(vendorUpdateInput.receipts.disconnect && {
                disconnect: vendorUpdateInput.receipts.disconnect,
              }),
              ...(vendorUpdateInput.receipts.create && {
                create: vendorUpdateInput.receipts.create,
              }),
              ...(vendorUpdateInput.receipts.update && {
                update: vendorUpdateInput.receipts.update,
              }),
            }
          : undefined,
        purchaseHistories: vendorUpdateInput.purchaseHistories
          ? {
              ...(vendorUpdateInput.purchaseHistories.connect && {
                connect: vendorUpdateInput.purchaseHistories.connect,
              }),
              ...(vendorUpdateInput.purchaseHistories.disconnect && {
                disconnect: vendorUpdateInput.purchaseHistories.disconnect,
              }),
              ...(vendorUpdateInput.purchaseHistories.create && {
                create: vendorUpdateInput.purchaseHistories.create,
              }),
              ...(vendorUpdateInput.purchaseHistories.update && {
                update: vendorUpdateInput.purchaseHistories.update,
              }),
            }
          : undefined,
      },
      include: {
        location: true,
        receipts: true,
        purchaseHistories: true,
      },
    });
  }

  remove(vendorID: string) {
    return this.prisma.vendor.delete({
      where: { vendorId: vendorID },
    });
  }

  findAll() {
    return this.prisma.vendor.findMany({
      include: {
        location: true,
        receipts: true,
        purchaseHistories: true,
      },
    });
  }

  findOne(vendorID: string) {
    return this.prisma.vendor.findUnique({
      where: { vendorId: vendorID },
      include: {
        location: true,
        receipts: true,
        purchaseHistories: true,
      },
    });
  }
}
